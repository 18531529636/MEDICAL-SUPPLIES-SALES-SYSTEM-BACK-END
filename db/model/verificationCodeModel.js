const mongoose = require("mongoose");

const verificationCodeSchema = new mongoose.Schema({
  mailBox: {
    type: String,
    require: true,
  },
  codeNumber: {
    type: String,
    require: true,
  },
  time: {
    type: Number,
    require: true,
  },
});

const verificationCode = mongoose.model(
  "verificationcode",
  verificationCodeSchema
);

module.exports = verificationCode;
