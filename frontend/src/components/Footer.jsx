import { Github, Linkedin, Mail, Heart, Sparkles } from "lucide-react";

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
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800/50"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800/50"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}