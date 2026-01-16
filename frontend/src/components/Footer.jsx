import React from 'react';
import { useSelector } from 'react-redux';
import { FiHeart, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const { theme } = useSelector((state) => state.ui);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`mt-auto py-6 px-6 border-t transition-colors ${
        theme === 'dark'
          ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700'
          : 'bg-white/70 backdrop-blur-xl border-gray-200'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand/Copyright */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Growth Hub</span>
            </span>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              Made with <FiHeart className="w-4 h-4 text-red-500 animate-pulse" /> for productivity
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/ManishSamarium"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/manish-yadav-91a0aa285/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a
              href="sam68iiitr@gmail.com"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              aria-label="Email"
            >
              <FiMail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Track your tasks • Reflect with journals • Grow every day 🚀
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
