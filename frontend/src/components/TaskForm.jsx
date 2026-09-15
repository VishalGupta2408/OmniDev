import { Code2, Loader2, Play } from "lucide-react";

export default function TaskForm({
  repoOwner,
  setRepoOwner,
  repoName,
  setRepoName,
  repoUrl,
  setRepoUrl,
  taskDescription,
  setTaskDescription,
  loading,
  handleSubmit,
}) {
  return (
    <section className="lg:col-span-6 bg-[#12131c]/70 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <h2 className="text-xl font-semibold mb-1 flex items-center gap-2 text-white">
        <Code2 className="w-5 h-5 text-purple-400" />
        Agent Task Configuration
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Enter your repository details and task description for automated PR generation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
              Repository Owner
            </label>
            <input
              type="text"
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-all text-gray-200"
              placeholder="e.g., username"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
              Repository Name
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-all text-gray-200"
              placeholder="e.g., my-repo"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
            Repository Clone URL
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 font-mono text-gray-200"
            placeholder="https://github.com/owner/repo.git"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
            Task Description
          </label>
          <textarea
            rows="4"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="e.g., Add a footer component"
            className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 text-gray-200 resize-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>OmniDev is executing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Agent & Create PR</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}