const mongoose = require("mongoose");
const buyerSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  loginNumber: {
    type: String,
    require: true,
  },
  passWord: {
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
