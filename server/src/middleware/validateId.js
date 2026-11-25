const mongoose = require('mongoose');
const { AppError } = require('../utils/helpers');

module.exports = () => (req, res, next, value) => {
  if (!mongoose.isValidObjectId(value)) {
    return next(new AppError('Invalid id', 400));
  }
  next();
};
