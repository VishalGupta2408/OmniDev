import { useState } from "react";
import {
  FileCode,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Code,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function DiffVisualizer({
  diffData,
  onApprove,
  onReject,
  approving,
}) {
  const [showRawDiff, setShowRawDiff] = useState(false);

  if (!diffData || !diffData.files) return null;

  // Calculate total added and deleted lines
  const totalAdded = diffData.files.reduce((acc, f) => acc + f.added, 0);
  const totalDeleted = diffData.files.reduce((acc, f) => acc + f.deleted, 0);

  return (
    <div className="bg-[#12131c]/90 border border-purple-500/40 rounded-2xl p-5 shadow-2xl space-y-4 my-4 backdrop-blur-xl animate-in fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-600/10 border border-purple-500/20 rounded-xl">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              Agent Completed Task
            </h3>
            <p className="text-[11px] text-gray-400">
              Build: <span className="text-emerald-400 font-medium">✓ Passed</span> | Files changed: <span className="text-purple-300 font-medium">{diffData.files.length}</span>
            </p>
          </div>
        </div>
        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-mono flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Awaiting Approval
        </span>
      </div>

      {/* Summary Stat Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0a0a0f] rounded-xl border border-gray-800/80 text-xs font-mono">
        <span className="text-gray-300 flex items-center gap-1.5">
          <FileCode className="w-4 h-4 text-purple-400" />
          {diffData.files.length} file{diffData.files.length > 1 ? "s" : ""} modified
        </span>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
            +{totalAdded}
          </span>
          <span className="text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20">
            -{totalDeleted}
          </span>
        </div>
      </div>

      {/* File Stats List */}
      <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto pr-1">
        {diffData.files.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#0a0a0f]/60 hover:bg-[#0a0a0f] px-3 py-2 rounded-lg border border-gray-800/60 transition-colors"
          >
            <span className="text-gray-300 truncate max-w-[280px]">
              📄 {item.file}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-emerald-400 font-semibold">
                +{item.added}
              </span>
              <span className="text-red-400 font-semibold">
                -{item.deleted}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Raw Diff View Toggle */}
      {diffData.rawDiff && (
        <div>
          <button
            onClick={() => setShowRawDiff(!showRawDiff)}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 font-mono transition-colors py-1"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showRawDiff ? "Hide Full Code Diff" : "[ View Full Diff ]"}</span>
            {showRawDiff ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showRawDiff && (
            <pre className="mt-2 p-3 bg-[#07080c] text-gray-300 font-mono text-[11px] rounded-xl border border-gray-800 overflow-x-auto max-h-60 leading-relaxed shadow-inner">
              {diffData.rawDiff}
            </pre>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onApprove}
          disabled={approving}
          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          <span>
            {approving ? "Pushing & Opening PR..." : "Approve & Create PR"}
          </span>
        </button>

        <button
          onClick={onReject}
          disabled={approving}
          className="bg-[#1a1b26] hover:bg-red-950/40 hover:text-red-400 text-gray-300 border border-gray-800 hover:border-red-900/50 font-medium px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          <span>Reject Changes</span>
        </button>
      </div>
    </div>
  );
}