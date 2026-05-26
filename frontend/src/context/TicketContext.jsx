import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import * as api from '../api/ticketApi';
import toast from 'react-hot-toast';

const TicketContext = createContext();

const initialState = {
  tickets: [],
  stats: {
    byStatus: { open: 0, in_progress: 0, resolved: 0, closed: 0 },
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    breachedCount: 0,
  },
  loading: true,
  error: null,
  filters: {
    status: '',
    priority: '',
    breached: false,
    search: '',
  },
};

function ticketReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TICKETS':
      return { ...state, tickets: action.payload, loading: false, error: null };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_TICKET':
      return { ...state, tickets: [action.payload, ...state.tickets] };
    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      };
    case 'DELETE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter((t) => t._id !== action.payload),
      };
    default:
      return state;
  }
}

export function TicketProvider({ children }) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchTickets = useCallback(async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.breached) params.breached = 'true';
      if (filters.search) params.search = filters.search;

      const result = await api.getTickets(params);
      dispatch({ type: 'SET_TICKETS', payload: result.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      toast.error('Failed to fetch tickets');
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await api.getStats();
      dispatch({ type: 'SET_STATS', payload: result.data });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const addTicket = useCallback(async (ticketData) => {
    const result = await api.createTicket(ticketData);
    dispatch({ type: 'ADD_TICKET', payload: result.data });
    fetchStats();
    return result.data;
  }, [fetchStats]);

  const updateStatus = useCallback(async (id, newStatus) => {
    const result = await api.updateTicketStatus(id, newStatus);
    dispatch({ type: 'UPDATE_TICKET', payload: result.data });
    fetchStats();
    return result.data;
  }, [fetchStats]);

  const removeTicket = useCallback(async (id) => {
    await api.deleteTicket(id);
    dispatch({ type: 'DELETE_TICKET', payload: id });
    fetchStats();
  }, [fetchStats]);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  // Fetch tickets when filters change
  useEffect(() => {
    fetchTickets(state.filters);
  }, [state.filters, fetchTickets]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const value = {
    ...state,
    fetchTickets,
    fetchStats,
    addTicket,
    updateStatus,
    removeTicket,
    setFilters,
  };

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context)
    throw new Error('useTickets must be used within TicketProvider');
  return context;
}
