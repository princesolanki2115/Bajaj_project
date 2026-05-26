import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLoader, FiMail, FiMessageSquare, FiBookmark } from 'react-icons/fi';
import { useTickets } from '../context/TicketContext';
import toast from 'react-hot-toast';

export default function CreateTicketModal({ isOpen, onClose }) {
  const { addTicket } = useTickets();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        subject: '',
        description: '',
        customerEmail: '',
        priority: 'medium',
      });
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    } else if (formData.subject.length > 200) {
      newErrors.subject = 'Subject cannot exceed 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear inline error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await addTicket(formData);
      toast.success('Ticket created successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-950/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg glass-card p-6 shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-100 dark:border-surface-700/50">
              <div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                  Create Support Ticket
                </h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  Submit ticket to board with priority triage
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FiBookmark className="w-3.5 h-3.5" />
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Summarize the support issue..."
                  className={`glass-input w-full text-sm ${
                    errors.subject ? 'border-red-500 focus:ring-red-400/50 focus:border-red-500' : ''
                  }`}
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FiMessageSquare className="w-3.5 h-3.5" />
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide detailed description of the problem..."
                  className={`glass-input w-full text-sm resize-none scrollbar-thin ${
                    errors.description ? 'border-red-500 focus:ring-red-400/50 focus:border-red-500' : ''
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FiMail className="w-3.5 h-3.5" />
                  Customer Email
                </label>
                <input
                  type="text"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="e.g. customer@example.com"
                  className={`glass-input w-full text-sm ${
                    errors.customerEmail ? 'border-red-500 focus:ring-red-400/50 focus:border-red-500' : ''
                  }`}
                />
                {errors.customerEmail && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">
                    {errors.customerEmail}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5">
                  Priority level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="glass-input w-full text-sm appearance-none bg-no-repeat bg-right pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  }}
                >
                  <option value="low">🟢 Low (72h SLA)</option>
                  <option value="medium">🟡 Medium (24h SLA)</option>
                  <option value="high">🟠 High (4h SLA)</option>
                  <option value="urgent">🔴 Urgent (1h SLA)</option>
                </select>
              </div>

              {/* Submit Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="btn-ghost text-sm text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Ticket'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
