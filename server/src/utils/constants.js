const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

const TICKET_PRIORITY = ['low', 'medium', 'high', 'urgent'];

const TICKET_CATEGORY = ['technical', 'billing', 'account', 'general', 'other'];

module.exports = {
  ROLES,
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY,
};
