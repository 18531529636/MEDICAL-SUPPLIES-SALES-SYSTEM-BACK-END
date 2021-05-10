const mongoose = require("mongoose");

const commoditySchema = new mongoose.Schema({
  commodityNumber: {
    type: String,
    require: true,
  },
  commodityName: {
    type: String,
    require: true,
  },
  commodityCurrentCount: {
    type: Number,
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
    type: Number,
    require: true,
  },
  classificationName: {
    type: String,
    require: true,
  },
  updateTime: {
    type: Number,
    require: true,
  },
});

const commodity = mongoose.model("commodity", commoditySchema);

module.exports = commodity;
