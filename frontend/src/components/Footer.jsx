import { Mail, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-[#0c0d14]/90 backdrop-blur-xl py-8 px-8 text-center text-xs text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand / Creator Info */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <p className="text-gray-400">
            Designed & Developed by{" "}
            <span className="text-white font-semibold text-sm">Vishal Gupta</span>
          </p>
        </div>

        {/* Center: System Status */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-gray-500 bg-[#12131c] px-3 py-1 rounded-full border border-gray-800/80">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>OmniDev v1.0 • Autonomous Agent Operational</span>
        </div>

        {/* Right: Links & Email */}
        <div className="flex items-center gap-4">
          <a
            href="mailto:vg4693@gmail.com"
            className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1.5 font-medium"
          >
            <Mail className="w-4 h-4 text-purple-400" />
            <span>vg4693@gmail.com</span>
          </a>

          <div className="h-4 w-[1px] bg-gray-800"></div>

          <div className="flex items-center gap-3">
            {/* GitHub SVG */}
            <a
              href="https://github.com/VishalGupta2408"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800/50"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn SVG */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800/50"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}