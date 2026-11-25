const Comment = require('../models/Comment');
const { AppError, asyncHandler } = require('../utils/helpers');
const { getAccessibleTicket } = require('../services/ticketAccess');
const { events, EVENTS } = require('../events');
const { TICKET_STATUS } = require('../utils/constants');

exports.getComments = asyncHandler(async (req, res) => {
  const ticket = await getAccessibleTicket(req.params.id, req.user);

  const comments = await Comment.find({ ticket: ticket._id })
    .populate('author', 'name role')
    .sort({ createdAt: 1 });

  res.json({ success: true, data: comments });
});

exports.addComment = asyncHandler(async (req, res) => {
  const ticket = await getAccessibleTicket(req.params.id, req.user);

  if (ticket.status === TICKET_STATUS.CLOSED) {
    throw new AppError('Cannot comment on a closed ticket', 400);
  }

  const comment = await Comment.create({
    ticket: ticket._id,
    author: req.user._id,
    message: req.body.message,
  });
  await comment.populate('author', 'name role');

  events.emit(EVENTS.COMMENT_ADDED, { ticket, comment, actor: req.user });

  res.status(201).json({ success: true, data: comment });
});
