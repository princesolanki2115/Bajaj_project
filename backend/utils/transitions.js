const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved'],
};

/**
 * Validate if a status transition is allowed
 * @param {string} currentStatus - Current ticket status
 * @param {string} newStatus - Desired new status
 * @returns {{ valid: boolean, message: string }}
 */
function validateTransition(currentStatus, newStatus) {
  if (currentStatus === newStatus) {
    return {
      valid: false,
      message: `Ticket is already in '${currentStatus}' status`,
    };
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed) {
    return {
      valid: false,
      message: `Unknown current status: '${currentStatus}'`,
    };
  }

  if (!allowed.includes(newStatus)) {
    return {
      valid: false,
      message: `Transition from '${currentStatus}' to '${newStatus}' is not allowed. Allowed transitions: ${allowed.join(', ')}`,
    };
  }

  return { valid: true, message: 'Transition allowed' };
}

module.exports = { ALLOWED_TRANSITIONS, validateTransition };
