const User = require('../models/User');
const { AppError, asyncHandler, signToken } = require('../utils/helpers');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.exists({ email });
  if (exists) {
    throw new AppError('Email is already registered', 409);
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: { user, token: signToken(user) },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json({
    success: true,
    data: { user, token: signToken(user) },
  });
});

exports.me = (req, res) => {
  res.json({ success: true, data: req.user });
};
