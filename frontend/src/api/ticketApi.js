import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const getTickets = async (params = {}) => {
  const { data } = await api.get('/tickets', { params });
  return data;
};

export const getStats = async () => {
  const { data } = await api.get('/tickets/stats');
  return data;
};

export const createTicket = async (ticketData) => {
  const { data } = await api.post('/tickets', ticketData);
  return data;
};

export const updateTicketStatus = async (id, status) => {
  const { data } = await api.patch(`/tickets/${id}`, { status });
  return data;
};

export const deleteTicket = async (id) => {
  const { data } = await api.delete(`/tickets/${id}`);
  return data;
};
