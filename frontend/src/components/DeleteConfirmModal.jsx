import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, ticketSubject }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-950/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md glass-card p-6 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                  Delete Ticket?
                </h3>
                <p className="text-xs text-surface-500 mt-1 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-surface-750">"{ticketSubject}"</span>? This action is permanent and cannot be undone.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-100 dark:border-surface-700/50">
              <button
                onClick={onClose}
                className="btn-ghost text-xs text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/15 hover:shadow-red-500/25 transition-all duration-200 active:scale-95"
              >
                Delete Ticket
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
