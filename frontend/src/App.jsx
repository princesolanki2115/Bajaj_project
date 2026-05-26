import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StatsStrip from './components/StatsStrip';
import Filters from './components/Filters';
import Board from './components/Board';
import CreateTicketModal from './components/CreateTicketModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-surface-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 transition-colors duration-500">
      <Navbar onNewTicket={() => setIsModalOpen(true)} />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <StatsStrip />
        <Filters />
        <Board />
      </main>
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
