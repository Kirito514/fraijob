// components/Footer.jsx
import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-gray-200 mt-24 py-12 px-6 text-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        {/* Left: Logo & Text */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">FraiJob</h2>
          <p className="text-gray-600">
            © {new Date().getFullYear()} FraiJob. All rights reserved.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4">
          {["Features", "Projects", "Community", "Jobs", "Pricing"].map(
            (label, i) => (
              <Link
                key={i}
                href={`#${label.toLowerCase()}`}
                className="hover:text-[#10B981] transition"
              >
                {label}
              </Link>
            )
          )}
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4 text-gray-500">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#10B981] transition"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#10B981] transition"
          >
            <Twitter size={20} />
          </a>
          <a
            href="mailto:hello@fraijob.com"
            className="hover:text-[#10B981] transition"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
