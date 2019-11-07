const mongoose = require('mongoose');

//@desc connect to database
const connectDB = async () => {
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  console.log(`MongoDB connected: ${db.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
