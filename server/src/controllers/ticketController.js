const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const { AppError, asyncHandler } = require('../utils/helpers');
const { getAccessibleTicket } = require('../services/ticketAccess');
const { events, EVENTS } = require('../events');
const { ROLES, TICKET_STATUS } = require('../utils/constants');

const isAdmin = (user) => user.role === ROLES.ADMIN;

exports.createTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.create({ ...req.body, createdBy: req.user._id });

  events.emit(EVENTS.TICKET_CREATED, { ticket, actor: req.user });

  res.status(201).json({ success: true, data: ticket });
});

exports.getTickets = asyncHandler(async (req, res) => {
  const filter = { ...req.validatedQuery };

  if (!isAdmin(req.user)) {
    filter.createdBy = req.user._id;
  }

  const tickets = await Ticket.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: tickets.length, data: tickets });
});

exports.getTicket = asyncHandler(async (req, res) => {
  const ticket = await getAccessibleTicket(req.params.id, req.user);
  await ticket.populate('createdBy', 'name email');

  const comments = await Comment.find({ ticket: ticket._id })
    .populate('author', 'name role')
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    data: { ...ticket.toObject(), comments },
  });
});

exports.updateTicket = asyncHandler(async (req, res) => {
  const ticket = await getAccessibleTicket(req.params.id, req.user);

  if (!ticket.createdBy.equals(req.user._id)) {
    throw new AppError('Only the ticket owner can edit ticket details', 403);
  }
  if (ticket.status !== TICKET_STATUS.OPEN) {
    throw new AppError('Ticket can only be edited while it is open', 400);
  }

  const changes = {};
  for (const [key, value] of Object.entries(req.body)) {
    if (ticket[key] !== value) {
      changes[key] = { from: ticket[key], to: value };
      ticket[key] = value;
    }
  }

  if (Object.keys(changes).length) {
    await ticket.save();
    events.emit(EVENTS.TICKET_UPDATED, { ticket, actor: req.user, changes });
  }

  res.json({ success: true, data: ticket });
});

exports.deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await getAccessibleTicket(req.params.id, req.user);

  if (!isAdmin(req.user) && ticket.status !== TICKET_STATUS.OPEN) {
    throw new AppError('Ticket can only be deleted while it is open', 400);
  }

  await Promise.all([
    Comment.deleteMany({ ticket: ticket._id }),
    ActivityLog.deleteMany({ ticket: ticket._id }),
    Notification.deleteMany({ ticket: ticket._id }),
    ticket.deleteOne(),
  ]);

  res.status(204).send();
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const ticket = await getAccessibleTicket(req.params.id, req.user);
  const { status } = req.body;
  const from = ticket.status;

  if (from === status) {
    throw new AppError(`Ticket is already ${status}`, 400);
  }

  ticket.status = status;
  ticket.resolvedAt = status === TICKET_STATUS.RESOLVED ? new Date() : undefined;
  await ticket.save();

  events.emit(EVENTS.TICKET_STATUS_CHANGED, { ticket, actor: req.user, from, to: status });
  if (status === TICKET_STATUS.RESOLVED) {
    events.emit(EVENTS.TICKET_RESOLVED, { ticket, actor: req.user });
  }

  res.json({ success: true, data: ticket });
});

exports.updatePriority = asyncHandler(async (req, res) => {
  const ticket = await getAccessibleTicket(req.params.id, req.user);
  const { priority } = req.body;
  const from = ticket.priority;

  if (from === priority) {
    throw new AppError(`Priority is already ${priority}`, 400);
  }

  ticket.priority = priority;
  await ticket.save();

  events.emit(EVENTS.TICKET_PRIORITY_CHANGED, { ticket, actor: req.user, from, to: priority });

  res.json({ success: true, data: ticket });
});

exports.getActivity = asyncHandler(async (req, res) => {
  const ticket = await getAccessibleTicket(req.params.id, req.user);

  const logs = await ActivityLog.find({ ticket: ticket._id })
    .populate('actor', 'name role')
    .sort({ createdAt: 1 });

  res.json({ success: true, data: logs });
});
