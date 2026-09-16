import express from "express";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { exec } from "child_process";
import util from "util";
import { fileURLToPath } from "url";
import {
  cloneRepo,
  readCodebase,
  applyBatchPatchesAndPush,
} from "../utils/gitHelper.js";
import { generateCodePatch } from "../utils/aiService.js";

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ------------------------------------------------------------------------------------------------------
// HELPER: Git Diff/File Stats generate karne ke liye
// ------------------------------------------------------------------------------------------------------
async function getGitDiffStats(repoPath) {
  try {
    const { stdout: numstat } = await execPromise("git diff --numstat", {
      cwd: repoPath,
    });
    const { stdout: rawDiff } = await execPromise("git diff", {
      cwd: repoPath,
    });

    const files = numstat
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [added, deleted, file] = line.split(/\s+/);
        return {
          file,
          added: parseInt(added, 10) || 0,
          deleted: parseInt(deleted, 10) || 0,
        };
      });

    return { files, rawDiff };
  } catch (err) {
    return { files: [], rawDiff: "" };
  }
}

// Global active sessions store (In-memory)
let activeSessions = {};

router.post("/run-agent", async (req, res) => {
  // SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Helper function: Real-time logs stream handler
  const sendLog = (message, status = "info", extra = {}) => {
    const payload = JSON.stringify({
      timestamp: new Date().toLocaleTimeString(),
      message,
      status,
      ...extra,
    });
    console.log(`[${status.toUpperCase()}] ${message}`);
    res.write(`data: ${payload}\n\n`);
  };

  try {
    const { repoUrl, taskDescription, repoOwner, repoName } = req.body;

    sendLog("🚀 Agent pipeline started...", "info");

    const sanitizedRepoName = repoName.trim().replace(/\s+/g, "-");
    const localRepoPath = path.join(__dirname, "../repos", sanitizedRepoName);

    // Existing repo folder cleanup
    if (fsSync.existsSync(localRepoPath)) {
      sendLog(`🧹 Cleaning up old repository workspace...`, "process");
      fsSync.rmSync(localRepoPath, { recursive: true, force: true });
    }

    // Git Clone Step
    sendLog(`📁 Cloning repository: ${repoUrl}`, "process");
    await cloneRepo(repoUrl, localRepoPath);

    // Reading Codebase Step
    sendLog("📖 Reading codebase structure...", "process");
    const codebase = await readCodebase(localRepoPath);

    // Self-Correction Loop
    let patches = null;
    let previousError = null;
    let maxAttempts = 3;
    let attempt = 0;
    let buildSuccess = false;

    while (attempt < maxAttempts && !buildSuccess) {
      attempt++;
      sendLog(
        `Attempt ${attempt}/${maxAttempts}: Requesting patch from Gemini API...`,
        "process"
      );

      // Passed sendLog to stream fallback & retry warnings in real-time
      patches = await generateCodePatch(
        codebase,
        taskDescription,
        previousError,
        sendLog
      );

      if (!patches || patches.length === 0) {
        throw new Error("AI did not return any valid patches for this task.");
      }

      // Local Disk Patch Application
      for (const patch of patches) {
        const normalizedFilePath = patch.filePath.replace(/\\/g, "/");
        const targetFile = path.join(localRepoPath, normalizedFilePath);
        await fs.mkdir(path.dirname(targetFile), { recursive: true });
        await fs.writeFile(targetFile, patch.updatedContent, "utf8");
        sendLog(`🛠️ Applied patch locally to: ${normalizedFilePath}`, "process");
      }

      // Build & Verification
      try {
        let packageJsonPath = path.join(localRepoPath, "package.json");
        let workDir = localRepoPath;

        if (!fsSync.existsSync(packageJsonPath)) {
          const subPath = path.join(localRepoPath, "backend", "package.json");
          if (fsSync.existsSync(subPath)) {
            packageJsonPath = subPath;
            workDir = path.join(localRepoPath, "backend");
            sendLog("📦 Found package.json inside backend/ directory.", "info");
          }
        }

        if (fsSync.existsSync(packageJsonPath)) {
          sendLog("📦 Running `npm install` for verification...", "process");
          await execPromise("npm install --legacy-peer-deps", {
            cwd: workDir,
          });
        }

        const pkg = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
        if (pkg.scripts && pkg.scripts.build) {
          sendLog("⚡ Validating build with `npm run build`...", "process");
          await execPromise("npm run build", { cwd: workDir });
        }

        buildSuccess = true;
        sendLog("✨ Build validation passed successfully!", "success");
      } catch (err) {
        previousError = err.message + "\n" + (err.stderr || "");
        sendLog(
          `⚠️ Attempt ${attempt} build failed. Triggering Self-Correction...`,
          "warning"
        );

        if (attempt >= maxAttempts) {
          throw new Error(
            `Max self-correction attempts reached. Last error: ${previousError}`
          );
        }
      }
    }

    // Calculating diff stats and session creation
    sendLog("Build validation passed! Calculating file changes...", "process");
    const diffData = await getGitDiffStats(localRepoPath);

    const sessionId = `omnidev-session-${Date.now()}`;
    activeSessions[sessionId] = {
      localRepoPath,
      repoOwner,
      repoName: sanitizedRepoName,
      taskDescription,
    };

    sendLog("Awaiting human approval to push PR...", "info", {
      diffData,
      sessionId,
      status: "awaiting_approval",
    });

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    sendLog(`❌ Execution failed: ${error.message}`, "error");
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

router.post("/approve-pr", async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = activeSessions[sessionId];
    if (!session) {
      throw new Error("Invalid session or session expired.");
    }

    const { localRepoPath, repoOwner, repoName, taskDescription } = session;

    const branchName = `omnidev-fix-${Date.now()}`;
    const commitMessage = `OmniDev Fix: ${taskDescription}`;

    console.log(`[APPROVE] Pushing changes and opening PR for session ${sessionId}...`);

    const prUrl = await applyBatchPatchesAndPush(
      localRepoPath,
      commitMessage,
      branchName,
      repoOwner,
      repoName
    );

    console.log(`[APPROVE] 🎉 Pull Request created successfully: ${prUrl}`);

    delete activeSessions[sessionId];

    res.json({ success: true, prUrl });
  } catch (error) {
    console.error(`[APPROVE] Approval failed: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;