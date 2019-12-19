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
    token = req.headers.authorization.split(' ')[1];
  }

  //check cookies
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  //check token exists in headers
  if (!token) {
    return next(new errorHandler('Not authorise to access this route', 401));
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new errorHandler('Not authorise to access this route', 401));
  }
});
