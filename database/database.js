const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Database connection failed");
      console.log(error);
      process.exit(1);
    });
};
