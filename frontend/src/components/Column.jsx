import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import TicketCard from './TicketCard';

export default function Column({ id, title, tickets, colorClass, onDeleteClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const getStatusDotColor = () => {
    switch (id) {
      case 'open':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-amber-500';
      case 'resolved':
        return 'bg-emerald-500';
      case 'closed':
        return 'bg-slate-500';
      default:
        return 'bg-surface-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`glass-card p-4 flex flex-col h-[calc(100vh-280px)] min-h-[500px] max-h-[800px] border-t-4 transition-colors duration-200 ${colorClass} ${
        isOver ? 'bg-surface-100/50 dark:bg-surface-800/40 ring-2 ring-primary-500/20' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-100 dark:border-surface-700/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor()}`} />
          <h3 className="font-bold text-surface-800 dark:text-surface-200 text-sm sm:text-base">
            {title}
          </h3>
        </div>
        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
          {tickets.length}
        </span>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1 scrollbar-thin space-y-3">
        <AnimatePresence mode="popLayout">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <TicketCard
                  ticket={ticket}
                  onDeleteClick={onDeleteClick}
                />
              </motion.div>
            ))
          ) : (
            <div className="h-32 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-xl flex items-center justify-center text-surface-400 text-xs text-center px-4">
              Drag tickets here
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
