const router = require('express').Router();
const notifications = require('../controllers/notificationController');
const validateId = require('../middleware/validateId');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', notifications.getNotifications);
router.patch('/read-all', notifications.markAllAsRead);
router.param('id', validateId());

router.patch('/:id/read', notifications.markAsRead);

module.exports = router;
