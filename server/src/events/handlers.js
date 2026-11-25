const { events, EVENTS } = require('./index');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { ROLES } = require('../utils/constants');

function log(ticket, actor, action, meta = {}) {
  return ActivityLog.create({
    ticket: ticket._id,
    actor: actor._id,
    action,
    meta,
  });
}

async function notifyAdmins(ticket, type, message, except) {
  const admins = await User.find({ role: ROLES.ADMIN }).select('_id');
  const docs = admins
    .filter((a) => !except || !a._id.equals(except))
    .map((a) => ({ recipient: a._id, ticket: ticket._id, type, message }));

  if (docs.length) await Notification.insertMany(docs);
}

function notifyOwner(ticket, actor, type, message) {
  if (ticket.createdBy.equals(actor._id)) return;
  return Notification.create({
    recipient: ticket.createdBy,
    ticket: ticket._id,
    type,
    message,
  });
}

function registerEventHandlers() {
  events.on(EVENTS.TICKET_CREATED, async ({ ticket, actor }) => {
    await log(ticket, actor, EVENTS.TICKET_CREATED, { title: ticket.title });
    await notifyAdmins(ticket, EVENTS.TICKET_CREATED, `New ticket raised: "${ticket.title}"`);
  });

  events.on(EVENTS.TICKET_UPDATED, async ({ ticket, actor, changes }) => {
    await log(ticket, actor, EVENTS.TICKET_UPDATED, { changes });
  });

  events.on(EVENTS.TICKET_STATUS_CHANGED, async ({ ticket, actor, from, to }) => {
    await log(ticket, actor, EVENTS.TICKET_STATUS_CHANGED, { from, to });
    await notifyOwner(
      ticket,
      actor,
      EVENTS.TICKET_STATUS_CHANGED,
      `Status of "${ticket.title}" changed from ${from} to ${to}`
    );
  });

  events.on(EVENTS.TICKET_PRIORITY_CHANGED, async ({ ticket, actor, from, to }) => {
    await log(ticket, actor, EVENTS.TICKET_PRIORITY_CHANGED, { from, to });
    await notifyOwner(
      ticket,
      actor,
      EVENTS.TICKET_PRIORITY_CHANGED,
      `Priority of "${ticket.title}" changed from ${from} to ${to}`
    );
  });

  events.on(EVENTS.TICKET_RESOLVED, async ({ ticket, actor }) => {
    await log(ticket, actor, EVENTS.TICKET_RESOLVED);
    await notifyOwner(
      ticket,
      actor,
      EVENTS.TICKET_RESOLVED,
      `Your ticket "${ticket.title}" has been resolved`
    );
  });

  events.on(EVENTS.COMMENT_ADDED, async ({ ticket, comment, actor }) => {
    await log(ticket, actor, EVENTS.COMMENT_ADDED, { commentId: comment._id });

    if (actor.role === ROLES.ADMIN) {
      await notifyOwner(
        ticket,
        actor,
        EVENTS.COMMENT_ADDED,
        `Support replied on "${ticket.title}"`
      );
    } else {
      await notifyAdmins(
        ticket,
        EVENTS.COMMENT_ADDED,
        `${actor.name} commented on "${ticket.title}"`,
        actor._id
      );
    }
  });
}

module.exports = registerEventHandlers;
