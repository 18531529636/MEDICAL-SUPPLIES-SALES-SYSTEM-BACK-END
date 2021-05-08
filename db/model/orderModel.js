const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    require: true,
  },
  temporary: {
    type: Boolean,
    require: true,
  },
  temporaryNumber: {
    type: String,
    require: true,
  },
  totalValue: {
    type: Number,
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
  buyerPhone: {
    type: String,
    require: true,
  },
  receivingAddress: {
    type: Object,
    require: true,
  },
  commodityList: {
    type: Array,
    require: true,
  },
  updateTime: {
    type: Number,
    require: true,
  },
});

const commodityList = {
  sallerId: {
    type: String,
    require: true,
  },
  sallerName: {
    type: String,
    require: true,
  },
  sallerPhone: {
    type: String,
    require: true,
  },
  commodityNumber: {
    type: String,
    require: true,
  },
  commodityCount: {
    type: Number,
    require: true,
  },
  commodityName: {
    type: String,
    require: true,
  },
  commodityImgUrl: {
    type: String,
    require: true,
  },
  commodityTotalValue: {
    type: Number,
    require: true,
  },
  introduction: {
    type: String,
    require: true,
  },
  marketValue: {
    type: String,
  },
  memberValue: {
    type: String,
    require: true,
  },
  classificationNumber: {
    type: String,
    require: true,
  },
  classificationName: {
    type: String,
    require: true,
  },
  goCourierNumber: {
    type: String,
  },
  backCourierNumber: {
    type: String,
  },
};
const order = mongoose.model("order", orderSchema);

module.exports = order;
