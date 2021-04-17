const Buyer = require("../model/buyerModel");
const express = require("express");
const router = express.Router();
// const verificationCodeData = require("../data/verificationCode");
const maildSender = require("../utils/mailer");

global.verificationCodeData = {};

router.post("/login", (req, res) => {
  const { loginNumber, passWord } = req.body;
  if (!loginNumber || !passWord) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  Buyer.find({
    loginNumber,
    passWord,
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
      res.send({ code: 0, msg: "此邮箱已存在，请找回密码" });
      return;
    }
    const findLoginNumber = await Buyer.find({
      loginNumber,
    });
    if (findLoginNumber.length) {
      res.send({ code: 0, msg: "此账号已存在，请找回密码" });
      return;
    }
    // TODO
    // 邮箱验证码存在服务器内存内,有问题,需解决 
    console.log("----------登录验证邮箱验证码");
    console.log(
      Object.prototype.toString.call(Object.keys(verificationCodeData)[0])
    );
    console.log(Object.prototype.toString.call(mailBox));
    console.log(verificationCodeData);
    console.log(verificationCodeData[mailBox]);
    console.log(verificationCodeData[mailBox].codeNumber);
    console.log(verificationCode);
    if (
      !verificationCodeData[mailBox] ||
      verificationCodeData[mailBox].codeNumber !== verificationCode
    ) {
      res.send({ code: 0, msg: "邮箱验证码不正确" });
    } else if (verificationCodeData[mailBox].time - new Date() >= 1000) {
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
  } catch (err) {
    console.log(err);
  }
});

router.get("/getVerificationCode", async (req, res) => {
  const { mailBox } = req.query;
  if (!mailBox) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  console.log(mailBox);
  try {
    verificationCodeData[mailBox] = {
      codeNumber: (Math.random() * 100000).toString().substr(0, 4),
    };
    console.log("邮箱验证码");
    console.log(verificationCodeData[mailBox].codeNumber);
    // maildSender(verificationCodeData[mailBox].codeNumber, mailBox).then(() => {
    //   console.log("成功发送邮箱验证码");
    //   verificationCodeData[mailBox].time = new Date();
    //   res.send({ code: 0, msg: `${mailBox} 邮箱验证码发送成功` });
    // });
    res.send({ code: 0, msg: `${mailBox} 邮箱验证码发送成功` });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
