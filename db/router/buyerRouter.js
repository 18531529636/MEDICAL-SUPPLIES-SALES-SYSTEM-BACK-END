const Buyer = require("@model/buyerModel");
const express = require("express");
const router = express.Router();
const verificationCodeModel = require("@model/verificationCodeModel");

global.verificationCodeData = {};

router.post("/login", (req, res) => {
  const { loginNumber, passWord } = req.body;
  if (!loginNumber || !passWord) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  Buyer.find({
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
    .then((responese) => {
      if (!responese.length) {
        res.send({ code: 0, msg: "登陆失败，账号或密码错误" });
        return;
      }
      res.send({ code: 0, msg: "登陆成功" });
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
    buyerName,
    passWord,
    mailBox,
  } = req.body;
  if (
    !loginNumber ||
    !passWord ||
    !buyerName ||
    !mailBox ||
    !verificationCode
  ) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    const findMailBox = await Buyer.find({
      mailBox,
    });
    if (findMailBox.length) {
      res.send({ code: 0, msg: "此邮箱已被注册，请找回密码" });
      return;
    }
    const findLoginNumber = await Buyer.find({
      loginNumber,
    });
    if (findLoginNumber.length) {
      res.send({ code: 0, msg: "此账号已存在，请找回密码" });
      return;
    }

    verificationCodeModel.find({ mailBox }).then((response) => {
      if (!response.length) {
        res.send({ code: 0, msg: "邮箱验证码不正确" });
        return;
      }
      const { codeNumber, time } = response[0];

      if (codeNumber !== verificationCode) {
        res.send({ code: 0, msg: "邮箱验证码不正确" });
      } else if (Date.now() - time >= 300000) {
        res.send({ code: 0, msg: "邮箱验证码失效" });
      } else {
        Buyer.insertMany({ loginNumber, passWord, buyerName, mailBox })
          .then(() => {
            res.send({ code: 0, msg: "注册成功" });
          })
          .catch((err) => {
            console.log("注册");
            console.log(err);
            res.send({ code: 0, msg: "注册失败" });
          });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
