const { z } = require('zod');
const {
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY,
} = require('../utils/constants');

const statuses = Object.values(TICKET_STATUS);

const createTicket = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000),
  category: z.enum(TICKET_CATEGORY).optional(),
  priority: z.enum(TICKET_PRIORITY).optional(),
});

const updateTicket = createTicket
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Nothing to update',
  });

const updateStatus = z.object({
  status: z.enum(statuses),
});

const updatePriority = z.object({
  priority: z.enum(TICKET_PRIORITY),
});

const listQuery = z.object({
  status: z.enum(statuses).optional(),
  priority: z.enum(TICKET_PRIORITY).optional(),
});

module.exports = {
  createTicket,
  updateTicket,
  updateStatus,
  updatePriority,
  listQuery,
};
