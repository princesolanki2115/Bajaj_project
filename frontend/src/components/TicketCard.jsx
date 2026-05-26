import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import {
  FiAlertTriangle,
  FiMail,
  FiClock,
  FiArrowRight,
  FiArrowLeft,
  FiTrash2,
} from 'react-icons/fi';
import { useTickets } from '../context/TicketContext';
import toast from 'react-hot-toast';

const PRIORITY_BADGES = {
  low: { bg: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200/30' },
  medium: { bg: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200/30' },
  high: { bg: 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200/30' },
  urgent: { bg: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/30' },
};

export default function TicketCard({ ticket, onDeleteClick }) {
  const { updateStatus } = useTickets();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 1,
    cursor: 'grab',
  };

  const getAgeDisplay = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleMove = async (newStatus) => {
    try {
      const updatePromise = updateStatus(ticket._id, newStatus);
      await toast.promise(updatePromise, {
        loading: `Updating ticket status...`,
        success: 'Ticket moved successfully!',
        error: (err) => err.message || 'Workflow transition blocked',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Determine allowed manual actions
  const getTransitions = () => {
    switch (ticket.status) {
      case 'open':
        return { next: 'in_progress', prev: null };
      case 'in_progress':
        return { next: 'resolved', prev: null };
      case 'resolved':
        return { next: 'closed', prev: 'in_progress' };
      case 'closed':
        return { next: null, prev: 'resolved' };
      default:
        return { next: null, prev: null };
    }
  };

  const { next, prev } = getTransitions();
  const badge = PRIORITY_BADGES[ticket.priority] || PRIORITY_BADGES.medium;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass group relative flex flex-col p-4 rounded-xl border transition-all duration-200 ${
        ticket.slaBreached
          ? 'border-red-500/50 dark:border-red-500/30 shadow-red-500/5 hover:border-red-500 bg-red-50/20 dark:bg-red-500/5'
          : 'border-white/20 hover:border-primary-400 dark:hover:border-primary-500'
      }`}
    >
      {/* SLA Breach Banner/Bar */}
      {ticket.slaBreached && (
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded-t-xl" />
      )}

      {/* Drag handle area (top portion of card) */}
      <div {...attributes} {...listeners} className="flex-1 select-none pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          {/* Priority Badge */}
          <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md border capitalize ${badge.bg}`}>
            {ticket.priority}
          </span>

          {/* Age and SLA Breach status */}
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <FiClock className="w-3.5 h-3.5" />
            <span className="font-semibold">{getAgeDisplay(ticket.ageMinutes)}</span>
            {ticket.slaBreached && (
              <span className="flex items-center text-red-500 font-bold bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded gap-0.5">
                <FiAlertTriangle className="w-3 h-3 animate-bounce" />
                BREACHED
              </span>
            )}
          </div>
        </div>

        {/* Subject */}
        <h4 className="font-bold text-sm text-surface-800 dark:text-surface-200 line-clamp-2 leading-snug mb-1">
          {ticket.subject}
        </h4>

        {/* Description */}
        <p className="text-xs text-surface-500 line-clamp-2 mb-3">
          {ticket.description}
        </p>

        {/* Customer Email */}
        <div className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
          <FiMail className="w-3.5 h-3.5" />
          <span className="truncate max-w-[180px] font-medium">{ticket.customerEmail}</span>
        </div>
      </div>

      {/* Card Action footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-surface-100 dark:border-surface-700/50 flex-shrink-0">
        <button
          onClick={() => onDeleteClick(ticket._id)}
          className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 transition-all duration-200"
          title="Delete Ticket"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {/* Back Button */}
          {prev && (
            <button
              onClick={() => handleMove(prev)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
              title={`Move back to ${prev.replace('_', ' ')}`}
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
          )}

          {/* Forward Button */}
          {next && (
            <button
              onClick={() => handleMove(next)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
              title={`Move to ${next.replace('_', ' ')}`}
            >
              <FiArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
