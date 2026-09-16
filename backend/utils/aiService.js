import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateCodePatch(
  codebase,
  taskDescription,
  previousError = null,
  sendLog = null
) {
  let prompt = `
  You are OmniDev, an autonomous AI software engineer. 
  Here is the codebase:
  ${JSON.stringify(codebase, null, 2)}

  Task to perform: ${taskDescription}

  Return a JSON array of objects representing the files to change, with the following format:
  [
    {
      "filePath": "relative/path/to/file.js",
      "updatedContent": "full updated content of the file"
    }
  ]
  `;

  if (previousError) {
    prompt += `
    \n PREVIOUS ATTEMPT FAILED WITH THE FOLLOWING ERROR:
    ${previousError}
    Please analyze this error, fix your previous implementation, and ensure the code compiles and works correctly without errors.
    `;

    prompt += `
    CRITICAL INSTRUCTIONS:
    1. Analyze the codebase carefully to identify ONLY the files that are strictly relevant to the task.
    2. Do NOT modify, touch, or hallucinate changes in unrelated files unless the task specifically demands it.
    3. Use the exact relative paths provided in the codebase.
    4. Return a JSON array of objects representing ONLY the files that need to be changed or created.
    `;
  }

  // Updated to gemini-3.6-flash and gemini-3.1-pro-preview
  const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-pro-preview"];
  let response = null;
  let lastError = null;

  for (const modelName of modelsToTry) {
    let delay = 4000;
    const maxRetriesPerModel = 3;

    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        if (sendLog) {
          sendLog(`🧠 Requesting patch from Gemini API (${modelName})...`, "process");
        }

        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  filePath: { type: "STRING" },
                  updatedContent: { type: "STRING" },
                },
                required: ["filePath", "updatedContent"],
              },
            },
          },
        });

        if (response && response.text) break;
      } catch (err) {
        lastError = err;
        const errString = typeof err === "string" ? err : JSON.stringify(err) + " " + (err.message || "");
        
        const isTransient =
          err.status === 503 ||
          err.statusCode === 503 ||
          errString.includes("503") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("high demand") ||
          err.status === 429;

        if (isTransient && attempt < maxRetriesPerModel) {
          const retryMsg = `⚠️ Gemini High Demand on ${modelName} (Attempt ${attempt}/${maxRetriesPerModel}). Retrying in ${delay / 1000}s...`;
          console.warn(retryMsg);
          if (sendLog) sendLog(retryMsg, "warning");
          await sleep(delay);
          delay *= 2;
        } else {
          if (sendLog) sendLog(`🔄 Switching model fallback from ${modelName}...`, "warning");
          break;
        }
      }
    }

    if (response && response.text) break;
  }

  if (!response || !response.text) {
    throw lastError || new Error("All Gemini API models are currently experiencing high demand. Please try again in 1 minute.");
  }

  const textResponse = response.text;
  const cleaned = textResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON Parse Error. Raw response:", cleaned);
    throw new Error("Failed to parse AI response into valid JSON: " + err.message);
  }
}