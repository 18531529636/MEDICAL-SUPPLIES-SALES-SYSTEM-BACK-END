const getCrypto = require("@utils/getCrypto");
const sallerModel = require("@model/sallerModel");
const buyerModel = require("@model/buyerModel");

module.exports = {
  getLoginCookie: function (data, type) {
    return new Promise((resolve, reject) => {
      const userType = { 0: "saller", 1: "buyer" }[type];
      const model = {
        saller: sallerModel,
        buyer: buyerModel,
      }[userType];
      model
        .find({ $or: [{ loginNumber: data }, { mailBox: data }] })
        .then((response) => {
          if (!response.length) {
            reject("a");
            return;
          }
          const { loginNumber, mailBox, _id } = response[0];
          const userName = response[0][`${userType}Name`];
          const loginCookie = getCrypto.encrypte({
            loginNumber,
            mailBox,
            userName,
            userId: _id,
          });
          resolve(loginCookie);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  checkLoginCookie: function (loginCookie, loginNumber) {
    let loginArr = getCrypto.decrypte(loginCookie);
    loginArr = Array.from(loginArr);
    if (!loginArr.indexOf(loginNumber)) {
      return false;
    }
    return true;
  },
};
