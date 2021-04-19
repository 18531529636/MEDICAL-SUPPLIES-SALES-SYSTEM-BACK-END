const Buyer = require("@@model/buyerModel");

const insert = {
  /**
   * @description: 插入信息
   * @param {object} insertData
   * @return {*}
   * @author: wuhaipeng
   */  
  insert(insertData) {
    Buyer.insertMany(insertData);
  },
};
