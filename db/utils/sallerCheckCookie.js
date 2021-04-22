const Saller = require("@model/sallerModel");
const getCrypto = require("@utils/getCrypto");

const needCheck = [
  { method: "POST", path: "/saller/getOrder" },
  { method: "POST", path: "/saller/CATCH" },
];

module.exports = (req, res, next) => {
  console.log(req.method);
  console.log(req.path);
  const shouldCheck = needCheck.some((item) => {
    if (item.path === req.path && req.path === item.path) {
      return true;
    }
    return false;
  });
  if (!shouldCheck) {
    console.log("通过中间件");
    next();
    return;
  }
  const { token } = req.cookies;
  console.log("中间件");
  const loginData = getCrypto.decrypte(token);
  const { userId } = loginData;
  Saller.findById(userId)
    .then((response) => {
      if (!response) {
        res({ code: -2, msg: "账号信息错误" });
        return;
      }
      console.log("通过中间件");
      next();
    })
    .catch((err) => {
      console.log(err);
      res({ code: -2, msg: "账号信息错误" });
      return;
    });
};
