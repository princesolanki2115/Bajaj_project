import React from 'react';
import { FiSearch, FiAlertTriangle, FiX } from 'react-icons/fi';
import { useTickets } from '../context/TicketContext';

export default function Filters() {
  const { filters, setFilters } = useTickets();

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };

  const handlePriorityChange = (e) => {
    setFilters({ priority: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFilters({ status: e.target.value });
  };

  const handleBreachedToggle = () => {
    setFilters({ breached: !filters.breached });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      breached: false,
      search: '',
    });
  };

  const hasActiveFilters =
    filters.status || filters.priority || filters.breached || filters.search;

  return (
    <div className="glass-card p-4 sm:p-5 mb-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 w-5 h-5" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by subject..."
            className="glass-input pl-11 w-full text-sm"
          />
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filters.priority}
            onChange={handlePriorityChange}
            className="glass-input w-full text-sm appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            }}
          >
            <option value="">All Priorities</option>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🟠 High</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="glass-input w-full text-sm appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            }}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* SLA Breached Toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.breached}
              onChange={handleBreachedToggle}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-surface-200 dark:bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300 flex items-center gap-1.5">
              <FiAlertTriangle className={`w-4 h-4 ${filters.breached ? 'text-red-500' : 'text-surface-400 dark:text-surface-500'}`} />
              SLA Breached
            </span>
          </label>

          {/* Clear Filters Button (Mobile Layout Option) */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-ghost text-xs text-primary-500 font-semibold flex items-center gap-1 sm:hidden ml-auto"
            >
              <FiX className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-100 dark:border-surface-700/50">
          <span className="text-xs font-semibold text-surface-400 dark:text-surface-500 mr-1">
            Active Filters:
          </span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-100/50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200/20">
              Query: "{filters.search}"
              <FiX className="w-3 h-3 cursor-pointer hover:text-primary-800" onClick={() => setFilters({ search: '' })} />
            </span>
          )}
          {filters.priority && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-100/50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200/20 capitalize">
              Priority: {filters.priority}
              <FiX className="w-3 h-3 cursor-pointer hover:text-primary-800" onClick={() => setFilters({ priority: '' })} />
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-100/50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200/20 capitalize">
              Status: {filters.status.replace('_', ' ')}
              <FiX className="w-3 h-3 cursor-pointer hover:text-primary-800" onClick={() => setFilters({ status: '' })} />
            </span>
          )}
          {filters.breached && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200/20">
              SLA Breached
              <FiX className="w-3 h-3 cursor-pointer hover:text-red-800" onClick={() => setFilters({ breached: false })} />
            </span>
          )}
          <button
            onClick={clearFilters}
            className="btn-ghost px-2.5 py-1 text-xs text-surface-500 hover:text-surface-700 hover:bg-surface-200/50 flex items-center gap-1 ml-auto hidden sm:flex"
          >
            <FiX className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
