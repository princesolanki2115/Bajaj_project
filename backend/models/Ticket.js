const mongoose = require('mongoose');

const SLA_TARGETS = {
  urgent: 60,       // 1 hour
  high: 240,        // 4 hours
  medium: 1440,     // 24 hours
  low: 4320,        // 72 hours
};

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxLength: [200, 'Subject cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxLength: [2000, 'Description cannot exceed 2000 characters'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be low, medium, high, or urgent',
      },
      default: 'medium',
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: 'Status must be open, in_progress, resolved, or closed',
      },
      default: 'open',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: ageMinutes
ticketSchema.virtual('ageMinutes').get(function () {
  const now = new Date();
  if (this.status === 'resolved' || this.status === 'closed') {
    const endTime = this.resolvedAt || now;
    return Math.floor((endTime - this.createdAt) / (1000 * 60));
  }
  return Math.floor((now - this.createdAt) / (1000 * 60));
});

// Virtual: slaBreached
ticketSchema.virtual('slaBreached').get(function () {
  const slaTarget = SLA_TARGETS[this.priority];
  if (!slaTarget) return false;

  if (this.status === 'resolved' || this.status === 'closed') {
    if (this.resolvedAt) {
      const resolutionMinutes = Math.floor(
        (this.resolvedAt - this.createdAt) / (1000 * 60)
      );
      return resolutionMinutes > slaTarget;
    }
    return false;
  }

  // For open/in_progress tickets
  const ageMinutes = Math.floor((new Date() - this.createdAt) / (1000 * 60));
  return ageMinutes > slaTarget;
});

// Index for common queries
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
