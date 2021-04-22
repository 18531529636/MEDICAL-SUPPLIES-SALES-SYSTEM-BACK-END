const mongoose = require("mongoose");

const commoditySchema = new mongoose.Schema({
  commodityNumber: {
    type: Number,
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
});

const commodity = mongoose.model("commodity", commoditySchema);

module.exports = commodity;
