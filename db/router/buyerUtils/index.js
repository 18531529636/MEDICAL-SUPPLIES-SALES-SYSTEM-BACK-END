const commodityClassification = require("@data/commodityClassification");
const CartModel = require("@model/cartModel");

module.exports = {
  handleCommodity(dataArray) {
    const arr = dataArray;
    if (!arr.length) {
      return;
    }
    const response = {};
    Object.keys(commodityClassification.classification).forEach((key) => {
      response[key] = arr.filter((item) => item.classificationNumber == key);
    });
    return response;
  },
  getClassification(dataArray) {
    const arr = dataArray;
    if (!arr.length) {
      return;
    }
    const classification = [];
    Object.keys(commodityClassification.classification).forEach((key) => {
      const have = arr.some((item) => item.classificationNumber == key);
      if (have) {
        classification.push({
          label: commodityClassification.classification[key],
          key,
        });
      }
    });
    const response = {
      classification,
      vagueClassification: commodityClassification.vagueClassification,
    };
    return response;
  },
  async getOrderCommodityList(cartNumberList) {
    const searchCondition = cartNumberList.map((item) => {
      return {
        cartNumber: item,
      };
    });
    const cartOrderList = await CartModel.find({ $or: searchCondition });
    const insertCommodityList = cartOrderList.map((item) => {
      return {
        commodityNumber: item.commodityNumber,
        commodityCount: item.commodityNumber,
        commodityName: item.commodityName,
        commodityImgUrl: item.commodityImgUrl,
        commodityTotalValue: item.commodityTotalValue,
        introduction: item.introduction,
        marketValue: item.marketValue,
        memberValue: item.memberValue,
        classificationNumber: item.classificationNumber,
        classificationName: item.classificationName,
        sallerId: item.sallerId,
        sallerName: item.sallerName,
        sallerPhone: item.sallerPhone,
        goCourierNumber: "",
        backCourierNumber: "",
      };
    });
    
    return insertCommodityList
  }
};
