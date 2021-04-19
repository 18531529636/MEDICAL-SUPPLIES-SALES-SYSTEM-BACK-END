const getCrypto = require("@utils/getCrypto");
const sallerModel = require("@model/sallerModel");
const buyerModel = require("@model/buyerModel");

module.exports = {
  getLoginCookie: function (data, type) {
    return new Promise((resolve, reject) => {
      const model = {
        0: sallerModel,
        1: buyerModel,
      }[type];
      model
        .find({ $or: [{ loginNumber: data }, { mailBox: data }] })
        .then((response) => {
          const { loginNumber, mailBox } = response[0];
          const loginCookie = getCrypto.encrypte([loginNumber, mailBox]);
          console.log(loginCookie);
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
