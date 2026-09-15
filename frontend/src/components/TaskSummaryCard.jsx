import {
  CheckCircle2,
  GitPullRequest,
  FileText,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

export default function TaskSummaryCard({
  repoOwner,
  repoName,
  taskDescription,
  prUrl,
  handleReset,
}) {
  return (
    <section className="lg:col-span-12 bg-[#12131c]/80 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Execution Completed Successfully
              </h3>
              <p className="text-xs text-gray-400">
                OmniDev AI analyzed your repository, applied requested patches, verified the build, and opened a Pull Request.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-mono pt-1">
            <div className="flex items-center gap-1.5 bg-[#0a0a0f] px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300">
              <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-gray-500">Target Repository:</span>
              <span className="text-purple-300 font-semibold">
                {repoOwner}/{repoName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0a0a0f] px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-gray-500">Task:</span>
              <span className="text-gray-200 truncate max-w-[280px]">
                {taskDescription}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleReset}
            className="flex-1 md:flex-initial bg-gray-800/80 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-xl border border-gray-700 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4 text-gray-400" />
            <span>New Task</span>
          </button>
          <a
            href={prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <span>View PR on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}