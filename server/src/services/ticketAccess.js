const Ticket = require('../models/Ticket');
const { AppError } = require('../utils/helpers');
const { ROLES } = require('../utils/constants');

async function getAccessibleTicket(id, user) {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  if (user.role !== ROLES.ADMIN && !ticket.createdBy.equals(user._id)) {
    throw new AppError('Ticket not found', 404);
  }

  return ticket;
}

module.exports = { getAccessibleTicket };
