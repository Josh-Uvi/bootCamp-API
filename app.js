const express = require('express');
const dotenv = require('dotenv');

//load env variables
dotenv.config({ path: './config/config.env' });

//initalise app
const app = express();

const Port = process.env.PORT || 5001;

//start server
app.listen(
  Port,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${Port}`)
);
