const mongoose = require("mongoose");

const connectDB = async () => {
  //await mongoose.connect(process.env.DB_CONNECTION_SECRET)
  await mongoose.connect("mongodb://127.0.0.1:27017/codemate");
};

module.exports = connectDB;
