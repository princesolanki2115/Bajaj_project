import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { useTickets } from '../context/TicketContext';
import Column from './Column';
import SkeletonLoader from './SkeletonLoader';
import DeleteConfirmModal from './DeleteConfirmModal';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'open', title: 'Open', color: 'border-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-amber-500' },
  { id: 'resolved', title: 'Resolved', color: 'border-emerald-500' },
  { id: 'closed', title: 'Closed', color: 'border-slate-500' },
];

export default function Board() {
  const { tickets, loading, updateStatus, removeTicket } = useTickets();
  const [deleteTicketId, setDeleteTicketId] = useState(null);

  // Configure sensors for Drag and Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Press and drag 8px to start dragging
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms press delay to start touch drag
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const ticketId = active.id;
    const newStatus = over.id;

    // Find the ticket being dragged
    const ticket = tickets.find((t) => t._id === ticketId);
    if (!ticket) return;

    // If dropped in the same column, do nothing
    if (ticket.status === newStatus) return;

    try {
      const updatePromise = updateStatus(ticketId, newStatus);
      await toast.promise(updatePromise, {
        loading: `Moving ticket to ${newStatus.replace('_', ' ')}...`,
        success: 'Ticket status updated successfully!',
        error: (err) => err.message || 'Workflow transition blocked',
      });
    } catch (err) {
      console.error('Drag and drop error:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTicketId) return;

    try {
      const deletePromise = removeTicket(deleteTicketId);
      await toast.promise(deletePromise, {
        loading: 'Deleting ticket...',
        success: 'Ticket deleted successfully!',
        error: 'Failed to delete ticket',
      });
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteTicketId(null);
    }
  };

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {COLUMNS.map((col) => {
            const columnTickets = tickets.filter((t) => t.status === col.id);

            return (
              <div key={col.id} className="h-full">
                {loading ? (
                  <div className="glass-card p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-100 dark:border-surface-700/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-surface-300 dark:bg-surface-600 animate-pulse"></span>
                        <h3 className="font-bold text-surface-400 dark:text-surface-500">
                          {col.title}
                        </h3>
                      </div>
                    </div>
                    <SkeletonLoader count={3} />
                  </div>
                ) : (
                  <Column
                    id={col.id}
                    title={col.title}
                    tickets={columnTickets}
                    colorClass={col.color}
                    onDeleteClick={(id) => setDeleteTicketId(id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </DndContext>

      <DeleteConfirmModal
        isOpen={deleteTicketId !== null}
        onClose={() => setDeleteTicketId(null)}
        onConfirm={handleDeleteConfirm}
        ticketSubject={
          tickets.find((t) => t._id === deleteTicketId)?.subject || ''
        }
      />
    </>
  );
}
