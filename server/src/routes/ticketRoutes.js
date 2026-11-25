const router = require('express').Router();
const tickets = require('../controllers/ticketController');
const comments = require('../controllers/commentController');
const validate = require('../middleware/validate');
const validateId = require('../middleware/validateId');
const { protect, authorize } = require('../middleware/auth');
const ticketSchemas = require('../validators/ticket');
const commentSchemas = require('../validators/comment');
const { ROLES } = require('../utils/constants');

router.use(protect);

router
  .route('/')
  .get(validate(ticketSchemas.listQuery, 'query'), tickets.getTickets)
  .post(authorize(ROLES.USER), validate(ticketSchemas.createTicket), tickets.createTicket);

router.param('id', validateId());

router
  .route('/:id')
  .get(tickets.getTicket)
  .patch(authorize(ROLES.USER), validate(ticketSchemas.updateTicket), tickets.updateTicket)
  .delete(tickets.deleteTicket);

router.patch(
  '/:id/status',
  authorize(ROLES.ADMIN),
  validate(ticketSchemas.updateStatus),
  tickets.updateStatus
);
router.patch(
  '/:id/priority',
  authorize(ROLES.ADMIN),
  validate(ticketSchemas.updatePriority),
  tickets.updatePriority
);

router.get('/:id/activity', tickets.getActivity);

router
  .route('/:id/comments')
  .get(comments.getComments)
  .post(validate(commentSchemas.createComment), comments.addComment);

module.exports = router;
