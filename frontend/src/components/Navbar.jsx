import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiPlus, FiLifeBuoy } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onNewTicket }) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <FiLifeBuoy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient leading-tight">
                DeskFlow
              </h1>
              <p className="text-[11px] font-medium text-surface-400 dark:text-surface-500 hidden sm:block -mt-0.5">
                Support Ticket Triage Board
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5 text-amber-400" />
                ) : (
                  <FiMoon className="w-5 h-5 text-surface-600" />
                )}
              </motion.div>
            </motion.button>

            {/* New Ticket button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewTicket}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Ticket</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
