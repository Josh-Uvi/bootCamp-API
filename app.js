const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const ratelimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const db = require('./config/db');
const handleError = require('./middleware/error');
const formidableMiddleware = require('express-formidable');

//@desc   custom logger middleware
// const logger = require('./middleware/logger');
// custom middleware to log requests to console
// app.use(logger);

//load env variables
dotenv.config({ path: './config.env' });

//connect to database
db();

//route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const reviews = require('./routes/reviews');
const admins = require('./routes/admins');

//initalise app
const app = express();

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

// third party dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = ratelimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 200
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Use the formidable Middleware
app.use(formidableMiddleware());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', admin);
app.use('/api/v1/reviews', reviews);
app.use('/admin', admins);

//error handler middleware
app.use(handleError);

//set port
const Port = process.env.PORT || 5001;

//start server
const server = app.listen(
  Port,
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${Port}`.magenta
      .bold
  )
);

//deal with unhandled promise rejections from server
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //end connection & exit process
  server.close(() => process.exit(1));
});
