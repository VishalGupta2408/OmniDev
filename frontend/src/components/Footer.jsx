export default function Footer() {
  return (
    <footer className="border-t border-gray-800/60 bg-[#0d0e15]/80 backdrop-blur-xl py-6 px-8 text-center text-base text-gray-400 mt-auto">
      <p>
        Hosted & Managed by{" "}
        <span className="text-white font-semibold text-lg">Vishal Gupta</span>{" "}
        • Contact:{" "}
        <a
          href="mailto:vg4693@gmail.com"
          className="text-purple-400 hover:underline font-medium"
        >
          vg4693@gmail.com
        </a>
      </p>
    </footer>
  );
}