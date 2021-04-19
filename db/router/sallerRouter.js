const Saller = require("@model/sallerModel");
const express = require("express");
const router = express.Router();
const verificationCodeModel = require("@model/verificationCodeModel");
const getCtypto = require("@utils/getCrypto");

router.post("/login", (req, res) => {
  const { loginNumber, passWord } = req.body;
  // res.header("set-cookie", "token=31234123;path=/;max-age=3600 ");
  // res.send({ code: 0, data: req.headers });
  // return;
  // res.cookie("token", "1231413213", {
  //   path: "/",
  //   maxAge: 36000,
  // });
  // res.send({ code: 0, data: req.headers });
  // return;

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
      res.send({ code: 0, msg: "此邮箱已被注册，请找回密码" });
      return;
    }
    const findLoginNumber = await Saller.find({
      loginNumber,
    });
    if (findLoginNumber.length) {
      res.send({ code: 0, msg: "此账号已存在，请找回密码" });
      return;
    }

    verificationCodeModel.find({ mailBox }).then((response) => {
      if (!response.length) {
        res.send({ code: 0, msg: "邀请码不正确" });
        return;
      }
      const { codeNumber, time } = response[0];

      if (codeNumber !== verificationCode) {
        res.send({ code: 0, msg: "邀请码不正确" });
      } else if (Date.now() - time >= 86400000) {
        res.send({ code: 0, msg: "邀请码失效" });
      } else {
        Saller.insertMany({ loginNumber, passWord, sallerName, mailBox })
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
