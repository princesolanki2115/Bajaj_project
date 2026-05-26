import React from 'react';
import { motion } from 'framer-motion';
import { FiInbox, FiClock, FiCheckCircle, FiArchive, FiAlertTriangle } from 'react-icons/fi';
import { useTickets } from '../context/TicketContext';

const statCards = [
  {
    key: 'open',
    label: 'Open',
    icon: FiInbox,
    gradient: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/20',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    icon: FiClock,
    gradient: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/20',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    icon: FiCheckCircle,
    gradient: 'from-emerald-500 to-green-600',
    shadow: 'shadow-emerald-500/20',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'closed',
    label: 'Closed',
    icon: FiArchive,
    gradient: 'from-slate-500 to-slate-600',
    shadow: 'shadow-slate-500/20',
    bg: 'bg-slate-50 dark:bg-slate-500/10',
    text: 'text-slate-600 dark:text-slate-400',
  },
];

export default function StatsStrip() {
  const { stats } = useTickets();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6 mb-4">
      {statCards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          className="glass-card p-4 flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
            <card.icon className={`w-5 h-5 ${card.text}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 leading-none">
              {stats.byStatus[card.key] || 0}
            </p>
            <p className="text-xs font-medium text-surface-500 mt-0.5">{card.label}</p>
          </div>
        </motion.div>
      ))}

      {/* SLA Breached Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className={`glass-card p-4 flex items-center gap-3 col-span-2 sm:col-span-1 ${
          stats.breachedCount > 0
            ? 'border-red-400/50 dark:border-red-500/30 ring-1 ring-red-400/20'
            : ''
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          stats.breachedCount > 0
            ? 'bg-red-50 dark:bg-red-500/10 animate-pulse-slow'
            : 'bg-red-50 dark:bg-red-500/10'
        }`}>
          <FiAlertTriangle className={`w-5 h-5 ${
            stats.breachedCount > 0 ? 'text-red-500' : 'text-red-400 dark:text-red-500'
          }`} />
        </div>
        <div>
          <p className={`text-2xl font-bold leading-none ${
            stats.breachedCount > 0
              ? 'text-red-600 dark:text-red-400'
              : 'text-surface-900 dark:text-surface-100'
          }`}>
            {stats.breachedCount || 0}
          </p>
          <p className="text-xs font-medium text-surface-500 mt-0.5">SLA Breached</p>
        </div>
      </motion.div>
    </div>
  );
}
