const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    require: true,
  },
  commodityId: {
    type: String,
    require: true,
  },
  commodityName: {
    type: String,
    require: true,
  },
  actualValue: {
    type: Number,
    require: true,
  },
  commodityCount: {
    type: Number,
    require: true,
  },
  actualPayment: {
    type: Number,
    require: true,
  },
  sallerId: {
    type: String,
    require: true,
  },
  sallerName: {
    type: String,
    require: true,
  },
  buyerId: {
    type: String,
    require: true,
  },
  buyerName: {
    type: String,
    require: true,
  },
  orderStatus: {
    type: Number,
    require: true,
  },
  goCourierNumber: {
    type: String,
  },
  backCourierNumber: {
    type: String,
  },
  setTime: {
    type: Number,
    require: true,
  },
});

const order = mongoose.model("order", orderSchema);

module.exports = order;
