const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const db = require('./config/db');
const handleError = require('./middleware/error');

//@desc   custom logger middleware
// const logger = require('./middleware/logger');
// custom middleware to log requests to console
// app.use(logger);

//load env variables
dotenv.config({ path: './config/config.env' });

//connect to database
db();

//route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

//initalise app
const app = express();

//body parser
app.use(express.json());

// third party dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//file uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

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
