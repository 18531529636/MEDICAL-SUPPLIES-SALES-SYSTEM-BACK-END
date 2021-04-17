const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    require: true,
  },
  loginNumber: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  mailBox: {
    type: String,
    require: true,
  },
  age: Number,
  sex: {
    type: Number,
    default: 0,
  },
});

const Buyer = mongoose.model("buyer", buyerSchema);

module.exports = Buyer;
