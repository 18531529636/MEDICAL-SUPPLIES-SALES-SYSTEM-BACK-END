const Buyer = require("../../model/buyerModel");

const find = {
  /**
   * @description: 根据信息插叙数据库判断该信息是否存在
   * @param {object} paramsObj
   * @return {boolean}
   * @author: wuhaipeng
   */
  isExists(paramsObj, response) {
    return new Promise((resolve, reject) => {
      Buyer.find(paramsObj)
        .then((res) => {
          if (!res.length) {
            resolve(false);
          }
          resolve(true);
        })
        .catch((err) => {
          response({ code: -1, msg: "数据库查询失败" });
          reject(err);
        });
    });
  },
};

module.exports = find;
