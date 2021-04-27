const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartNumber: {
    type: String,
    require: true,
  },
  updateTime: {
    type: Number,
    require: true,
  },
  buyerId: {
    type: String,
    require: true,
  },
  commodityCount: {
    type: Number,
    require: true,
  },
  commodityTotalValue: {
    type: Number,
    require: true,
  },
  commodityNumber: {
    type: String,
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
  // 简介
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
  classificationNumber: {
    type: String,
    require: true,
  },
  classificationName: {
    type: String,
    require: true,
  },
});

const cart = mongoose.model("cart", cartSchema);

module.exports = cart;
