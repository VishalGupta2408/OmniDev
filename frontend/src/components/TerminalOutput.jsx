import {
  Terminal,
  Trash2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
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
  return (
    <section className="lg:col-span-6 flex flex-col gap-4 w-full">
      <div className="bg-[#0c0d14] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
        {/* Header Bar */}
        <div className="bg-[#12131d] px-4 py-3 border-b border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            </div>
            <span className="text-xs font-mono text-gray-400 ml-2 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              omnidev-execution.log
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
              <span className="text-xs font-mono text-purple-400 animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                STREAMING
              </span>
            )}
          </div>
        </div>

        {/* Logs Container */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 bg-[#08090d]/90">
          {logs.length === 0 && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
              <Terminal className="w-8 h-8 mb-2 opacity-40" />
              <p>Ready for execution.</p>
              <p className="text-[11px] text-gray-600 mt-1">
                Fill repository details and click Run Agent to watch live terminal output.
              </p>
            </div>
          )}

          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2.5 leading-relaxed">
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

        {/* Success PR Link Banner */}
        {prUrl && (
          <div className="bg-emerald-950/40 border-t border-emerald-500/30 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Pull Request Opened!</span>
            </div>
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30 transition-all flex items-center gap-1 font-semibold"
            >
              <span>View PR</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-950/40 border-t border-red-500/30 p-3 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="break-all">{error}</span>
          </div>
        )}
      </div>
    </section>
  );
}