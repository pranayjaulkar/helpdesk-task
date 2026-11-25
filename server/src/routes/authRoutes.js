const router = require('express').Router();
const auth = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const schemas = require('../validators/auth');

router.post('/register', validate(schemas.register), auth.register);
router.post('/login', validate(schemas.login), auth.login);
router.get('/me', protect, auth.me);

module.exports = router;
