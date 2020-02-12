const ErrorHandler = require('../utils/errorHandler');

// @desc handle server error
const handleError = (err, req, res, next) => {
  //copy the error from the err object
  let error = { ...err };
  error.message = err.message;

  //log to console for dev
  console.log(err.stack.red);

  //mongoose wrong ObjectID
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorHandler(message, 404);
  }

  //mongoose duplicate key error handler
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorHandler(message, 400);
  }

  //mongoose validation error handler
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = handleError;
