const express = require("express");
const router = express.Router();
const Saller = require("@model/sallerModel");
const verificationCodeModel = require("@model/verificationCodeModel");
const orderModel = require("@model/orderModel");
const loginCookie = require("@utils/loginCookie");
const updateVerificationCode = require("@utils/updateVerificationCode");
const getCrypto = require("@utils/getCrypto");

router.post("/login", (req, res) => {
  const { loginNumber, passWord } = req.body;
  if (!loginNumber || !passWord) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  Saller.find({
    $or: [
      {
        loginNumber,
        passWord,
      },
      {
        mailBox: loginNumber,
        passWord,
      },
    ],
  })
    .then(async (responese) => {
      if (!responese.length) {
        res.send({ code: -2, msg: "登陆失败，账号或密码错误" });
        return;
      }
      const loginToken = await loginCookie.getLoginCookie(loginNumber, 0);
      console.log("loginToken");
      console.log(loginToken);
      updateVerificationCode(loginNumber, "", -1).then(() => {
        res.cookie("token", loginToken, { path: "/" });
        res.send({ code: 0, msg: "登陆成功" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: "数据查询错误！" });
    });
});

router.post("/register", async (req, res) => {
  const {
    loginNumber,
    verificationCode,
    sallerName,
    passWord,
    mailBox,
  } = req.body;
  if (
    !loginNumber ||
    !passWord ||
    !sallerName ||
    !mailBox ||
    !verificationCode
  ) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    const findMailBox = await Saller.find({
      mailBox,
    });
    if (findMailBox.length) {
      res.send({ code: -2, msg: "此邮箱已被注册，请找回密码" });
      return;
    }
    const findLoginNumber = await Saller.find({
      loginNumber,
    });
    if (findLoginNumber.length) {
      res.send({ code: -2, msg: "此账号已存在，请找回密码" });
      return;
    }

    verificationCodeModel.find({ mailBox }).then((response) => {
      if (!response.length) {
        res.send({ code: -2, msg: "邀请码不正确" });
        return;
      }
      const { codeNumber, time } = response[0];

      if (codeNumber !== verificationCode) {
        res.send({ code: -2, msg: "邀请码不正确" });
      } else if (Date.now() - time >= 86400000) {
        res.send({ code: -2, msg: "邀请码失效" });
      } else {
        Saller.insertMany({ loginNumber, passWord, sallerName, mailBox })
          .then(() => {
            res.send({ code: 0, msg: "注册成功" });
          })
          .catch((err) => {
            console.log("注册");
            console.log(err);
            res.send({ code: -2, msg: "注册失败" });
          });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/getOrder", (req, res) => {
  const { sallerId } = req.body;
  if (!sallerId) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  orderModel
    .find({ sallerId: sallerId })
    .then((response) => {
      res.send({ code: 0, msg: "查询成功", content: response });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -2, msg: "查询错误" });
    });
});

router.post("/setCourierNumber", (req, res) => {
  const { sallerId, orderNumber, courierNumber } = req.body;
  if (!sallerId || !orderNumber || !courierNumber) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  orderModel
    .findOneAndUpdate(
      { sallerId, orderNumber },
      { $set: { goCourierNumber: courierNumber, orderStatus: 1 } }
    )
    .then((response) => {
      console.log(response);
      if (!response) {
        res.send({ code: -2, msg: "失败" });
        return;
      }
      res.send({ code: 0, msg: "订单快递单号更新成功" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: "失败" });
    });
});

router.post("/handleReturnApply", (req, res) => {
  const { sallerId, orderNumber, isAgree } = req.body;
  if (!sallerId || !orderNumber || !isAgree) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  orderModel
    .findOneAndUpdate(
      { sallerId, orderNumber },
      { $set: { orderStatus: isAgree ? 5 : 4 } }
    )
    .then((response) => {
      console.log(response);
      if (!response) {
        res.send({ code: -2, msg: "失败" });
        return;
      }
      res.send({
        code: 0,
        msg: `已${isAgree ? "同意" : "拒绝"}订单 ${orderNumber} 的退货申请`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: "失败" });
    });
});
module.exports = router;
