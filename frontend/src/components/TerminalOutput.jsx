import {
  Terminal,
  Trash2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Loader2,
  GitBranch,
  Cpu,
  FileCode,
  ShieldCheck,
  Clock
} from "lucide-react";

export default function TerminalOutput({
  logs,
  loading,
  error,
  prUrl,
  handleClearLogs,
  logsEndRef,
  getLogColor,
}) {
  // Helper to check execution milestones based on logs
  const hasStarted = logs.length > 0;
  const isCloned = logs.some((l) => l.message.includes("Cloning repository"));
  const isAnalyzed = logs.some((l) => l.message.includes("Reading codebase"));
  const isCoding = logs.some((l) => l.message.includes("Requesting patch") || l.message.includes("Applied patch"));
  const isBuilding = logs.some((l) => l.message.includes("Running `npm install`") || l.message.includes("Validating build"));
  const isPassed = logs.some((l) => l.message.includes("Build validation passed"));

  return (
    <section className="lg:col-span-6 flex flex-col gap-4 w-full">
      <div className="bg-[#12131c]/70 border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px] backdrop-blur-xl">
        {/* Header Bar */}
        <div className="bg-[#1a1b26] px-4 py-3 border-b border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            </div>
            <span className="text-xs font-mono text-gray-300 ml-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              OmniDev Autonomous Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            {logs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 font-mono"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Logs</span>
              </button>
            )}
            {loading && (
              <span className="text-xs font-mono text-purple-400 animate-pulse flex items-center gap-1.5 bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-800/50">
                <Loader2 className="w-3 h-3 animate-spin" />
                AGENT RUNNING
              </span>
            )}
          </div>
        </div>

        {/* Timeline & Execution View */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#0a0a0f]">
          {!hasStarted && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
              <Terminal className="w-10 h-10 mb-3 opacity-30 text-purple-400" />
              <p className="text-sm font-medium text-gray-400">Waiting for agent execution...</p>
              <p className="text-xs text-gray-600 mt-1 max-w-xs">
                Fill your repository details and task description on the left to trigger autonomous coding.
              </p>
            </div>
          )}

          {/* Step-by-Step Milestones / Timeline */}
          {hasStarted && (
            <div className="bg-[#12131c] border border-gray-800/80 rounded-xl p-4 mb-4 space-y-2.5 shadow-inner">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Execution Pipeline
              </p>
              
              <div className="space-y-2 text-xs font-mono">
                <div className={`flex items-center gap-2 ${isCloned ? "text-emerald-400" : "text-gray-500"}`}>
                  {isCloned ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Loader2 className="w-4 h-4 animate-spin text-purple-400" />}
                  <span>Repository Cloned & Workspace Ready</span>
                </div>
                <div className={`flex items-center gap-2 ${isAnalyzed ? "text-emerald-400" : "text-gray-500"}`}>
                  {isAnalyzed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : (isCloned ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <span className="w-4 h-4 inline-block text-center">•</span>)}
                  <span>Codebase Structure Analyzed</span>
                </div>
                <div className={`flex items-center gap-2 ${isCoding ? "text-emerald-400" : "text-gray-500"}`}>
                  {isCoding ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : (isAnalyzed ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <span className="w-4 h-4 inline-block text-center">•</span>)}
                  <span>Gemini AI Patch Generation & Self-Healing</span>
                </div>
                <div className={`flex items-center gap-2 ${isPassed ? "text-emerald-400" : "text-gray-500"}`}>
                  {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : (isCoding ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <span className="w-4 h-4 inline-block text-center">•</span>)}
                  <span>Build & Dependency Verification (`npm build`)</span>
                </div>
              </div>
            </div>
          )}

          {/* Raw Terminal Logs collapsible/view */}
          <div className="space-y-1.5 font-mono text-[11px] bg-[#07080c] p-3 rounded-xl border border-gray-900">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">Terminal Output Stream</p>
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 leading-relaxed">
                <span className="text-gray-600 text-[10px] select-none pt-0.5">
                  [{log.timestamp}]
                </span>
                <span className={`flex-1 break-words ${getLogColor(log.status)}`}>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Success PR Link Banner */}
        {prUrl && (
          <div className="bg-emerald-950/60 border-t border-emerald-500/30 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Pull Request successfully generated & ready for review!</span>
            </div>
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-lg shadow-emerald-500/20"
            >
              <span>View Pull Request</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-950/60 border-t border-red-500/30 p-3.5 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="break-all font-mono">{error}</span>
          </div>
        )}
      </div>
    </section>
  );
}