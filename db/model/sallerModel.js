const mongoose = require("mongoose");
const sallerSchema = new mongoose.Schema({
  sallerName: {
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
const saller = mongoose.model("saller", sallerSchema);
module.exports = saller;
