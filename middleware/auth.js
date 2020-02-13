const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorHandler = require('../utils/errorHandler');
const User = require('../models/User');

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  //get token from the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  //check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //check token exists in headers
  if (!token) {
    return next(new errorHandler('Not authorised to access this route', 401));
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new errorHandler('Not authorised to access this route', 401));
  }
});

//grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler(
          `User role ${req.user.role} is not authorised to access this route`,
          403
        )
      );
    }
    next();
  };
};
