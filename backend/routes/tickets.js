const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Ticket = require('../models/Ticket');
const { validateTransition } = require('../utils/transitions');

// Validation middleware for creating tickets
const ticketValidation = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('customerEmail')
    .trim()
    .notEmpty()
    .withMessage('Customer email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent'),
];

// Helper: handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  return null;
};

// ============================================
// GET /api/tickets/stats
// Must be defined BEFORE /:id route
// ============================================
router.get('/stats', async (req, res, next) => {
  try {
    // Aggregate counts by status
    const statusAgg = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byStatus = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    statusAgg.forEach((item) => {
      byStatus[item._id] = item.count;
    });

    // Aggregate counts by priority
    const priorityAgg = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const byPriority = { low: 0, medium: 0, high: 0, urgent: 0 };
    priorityAgg.forEach((item) => {
      byPriority[item._id] = item.count;
    });

    // Compute breached count using virtuals (need to load documents)
    const unresolvedTickets = await Ticket.find({
      status: { $in: ['open', 'in_progress'] },
    });
    const breachedCount = unresolvedTickets.filter(
      (t) => t.slaBreached
    ).length;

    res.json({
      success: true,
      data: {
        byStatus,
        byPriority,
        breachedCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/tickets
// ============================================
router.post('/', ticketValidation, async (req, res, next) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { subject, description, customerEmail, priority } = req.body;

    const ticket = await Ticket.create({
      subject,
      description,
      customerEmail,
      priority: priority || 'medium',
    });

    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/tickets
// ============================================
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, breached, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (search) {
      filter.subject = { $regex: search, $options: 'i' };
    }

    let tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    // Filter by SLA breach (computed via virtual)
    if (breached === 'true') {
      tickets = tickets.filter((t) => t.slaBreached);
    }

    res.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PATCH /api/tickets/:id
// ============================================
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    // Validate transition
    const transition = validateTransition(ticket.status, newStatus);
    if (!transition.valid) {
      return res.status(400).json({
        success: false,
        error: transition.message,
      });
    }

    // Handle resolvedAt
    if (newStatus === 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (
      ticket.status === 'resolved' &&
      newStatus === 'in_progress'
    ) {
      ticket.resolvedAt = null;
    }

    ticket.status = newStatus;
    await ticket.save();

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// DELETE /api/tickets/:id
// ============================================
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    res.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
