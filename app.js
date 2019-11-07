const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const db = require('./config/db');

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

//initalise app
const app = express();

//body parser
app.use(express.json());

// third party dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//mount routes
app.use('/api/v1/bootcamps', bootcamps);

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
