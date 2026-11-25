const config = require('../config');
const { AppError } = require('../utils/helpers');

const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  if (statusCode === 500) {
    console.error(err);
    if (config.env === 'production') message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details && { errors: err.details }),
  });
};

module.exports = { notFound, errorHandler };
