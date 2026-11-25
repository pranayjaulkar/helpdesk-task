const EventEmitter = require('events');

const EVENTS = {
  TICKET_CREATED: 'ticket.created',
  TICKET_UPDATED: 'ticket.updated',
  TICKET_STATUS_CHANGED: 'ticket.status_changed',
  TICKET_PRIORITY_CHANGED: 'ticket.priority_changed',
  TICKET_RESOLVED: 'ticket.resolved',
  COMMENT_ADDED: 'comment.added',
};

class AppEvents extends EventEmitter {
  on(event, listener) {
    return super.on(event, async (payload) => {
      try {
        await listener(payload);
      } catch (err) {
        console.error(`Error handling "${event}":`, err.message);
      }
    });
  }
}

const events = new AppEvents();

module.exports = { events, EVENTS };
