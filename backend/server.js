require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/tickets');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // In production, be strict. In dev, allow all.
        if (process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'DeskFlow API is running',
    version: '1.0.0',
    endpoints: {
      tickets: '/api/tickets',
      stats: '/api/tickets/stats',
    },
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'DeskFlow API v1',
    endpoints: {
      'POST /api/tickets': 'Create a new ticket',
      'GET /api/tickets': 'Get all tickets (with filters)',
      'GET /api/tickets/stats': 'Get ticket statistics',
      'PATCH /api/tickets/:id': 'Update ticket status',
      'DELETE /api/tickets/:id': 'Delete a ticket',
    },
  });
});

// Routes
app.use('/api/tickets', ticketRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DeskFlow API server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
