import { useState } from "react";
import {
  FileCode,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Code,
} from "lucide-react";

export default function DiffVisualizer({
  diffData,
  onApprove,
  onReject,
  approving,
}) {
  const [showRawDiff, setShowRawDiff] = useState(false);

  if (!diffData || !diffData.files) return null;

  return (
    <div className="bg-[#12131c] border border-purple-500/40 rounded-2xl p-5 shadow-2xl space-y-4 my-4 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white text-sm">
            Changed Files ({diffData.files.length})
          </h3>
        </div>
        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-mono">
          ⏸️ Awaiting Approval
        </span>
      </div>

      {/* File Stats List */}
      <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto pr-1">
        {diffData.files.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#0a0a0f] px-3 py-2 rounded-lg border border-gray-800/80"
          >
            <span className="text-gray-300 truncate max-w-[300px]">
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
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showRawDiff ? "Hide Full Diff" : "[ View Full Diff ]"}</span>
            {showRawDiff ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          {showRawDiff && (
            <pre className="mt-2 p-3 bg-[#08090d] text-gray-300 font-mono text-[11px] rounded-xl border border-gray-800 overflow-x-auto max-h-60 leading-relaxed">
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
          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          <span>
            {approving ? "Pushing & Opening PR..." : "Approve & Create PR"}
          </span>
        </button>

        <button
          onClick={onReject}
          disabled={approving}
          className="bg-gray-800 hover:bg-red-950/50 hover:text-red-400 text-gray-300 border border-gray-700 font-medium px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" />
          <span>Reject Changes</span>
        </button>
      </div>
    </div>
  );
}
