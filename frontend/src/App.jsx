import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TerminalOutput from "./components/TerminalOutput";
import DiffVisualizer from "./components/DiffVisualizer";
import TaskSummaryCard from "./components/TaskSummaryCard";
import Footer from "./components/Footer";

export default function App() {
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [prUrl, setPrUrl] = useState("");
  const [error, setError] = useState("");

  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  // Approval & Diff Visualizer States
  const [diffData, setDiffData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleClearLogs = () => setLogs([]);

  const handleReset = () => {
    setRepoOwner("");
    setRepoName("");
    setRepoUrl("");
    setTaskDescription("");
    setLogs([]);
    setPrUrl("");
    setError("");
    setDiffData(null);
    setSessionId(null);
    setAwaitingApproval(false);
    setApproving(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrUrl("");
    setLogs([]);
    setDiffData(null);
    setSessionId(null);
    setAwaitingApproval(false);

    try {
      const API_BASE_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/run-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoOwner, repoName, repoUrl, taskDescription }),
      });

      if (!response.ok) {
        throw new Error(`Server Error (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();

        for (const part of parts) {
          if (part.startsWith("data: ")) {
            const dataStr = part.replace("data: ", "").trim();

            if (dataStr === "[DONE]") {
              setLoading(false);
              continue;
            }

            try {
              const logObj = JSON.parse(dataStr);
              setLogs((prev) => [...prev, logObj]);

              if (logObj.prUrl) setPrUrl(logObj.prUrl);
              if (logObj.status === "error") setError(logObj.message);

              // Capture approval pause trigger from backend
              if (logObj.status === "awaiting_approval") {
                setDiffData(logObj.diffData || null);
                setSessionId(logObj.sessionId || null);
                setAwaitingApproval(true);
                setLoading(false);
              }
            } catch (err) {
              console.error("SSE parse error:", err);
            }
          }
        }
      }
    } catch (err) {
      setError(err.message || "Failed to establish log stream connection.");
    } finally {
      setLoading(false);
    }
  };

  // Human-in-the-loop: Approve Handler
  const handleApprovePR = async () => {
    setApproving(true);
    setError("");

    try {
      const API_BASE_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

      const res = await fetch(`${API_BASE_URL}/api/approve-pr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (data.success && data.prUrl) {
        setPrUrl(data.prUrl);
        setAwaitingApproval(false);
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            message: "🎉 PR approval confirmed! Code pushed and Pull Request opened successfully.",
            status: "success",
            prUrl: data.prUrl,
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to approve PR");
      }
    } catch (err) {
      setError(err.message || "Approval process failed.");
    } finally {
      setApproving(false);
    }
  };

  // Human-in-the-loop: Reject Handler
  const handleRejectPR = () => {
    setAwaitingApproval(false);
    setDiffData(null);
    setSessionId(null);
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        message: "❌ Code changes rejected by user. Execution stopped.",
        status: "warning",
      },
    ]);
  };

  const getLogColor = (status) => {
    switch (status) {
      case "success":
        return "text-emerald-400 font-semibold";
      case "process":
        return "text-blue-400";
      case "warning":
        return "text-amber-400";
      case "error":
        return "text-red-400 font-semibold";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col selection:bg-purple-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column (5 spans) */}
        <div className="lg:col-span-5 w-full">
          <TaskForm
            repoOwner={repoOwner}
            setRepoOwner={setRepoOwner}
            repoName={repoName}
            setRepoName={setRepoName}
            repoUrl={repoUrl}
            setRepoUrl={setRepoUrl}
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            loading={loading}
            handleSubmit={handleSubmit}
          />
        </div>

        {/* Right Terminal & Approval Column (7 spans) */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <TerminalOutput
            logs={logs}
            loading={loading}
            error={error}
            prUrl={prUrl}
            handleClearLogs={handleClearLogs}
            logsEndRef={logsEndRef}
            getLogColor={getLogColor}
          />

          {awaitingApproval && (
            <DiffVisualizer
              diffData={diffData}
              onApprove={handleApprovePR}
              onReject={handleRejectPR}
              approving={approving}
            />
          )}
        </div>

        {/* Success Card Full Width */}
        {prUrl && (
          <div className="lg:col-span-12 w-full">
            <TaskSummaryCard
              repoOwner={repoOwner}
              repoName={repoName}
              taskDescription={taskDescription}
              prUrl={prUrl}
              handleReset={handleReset}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}