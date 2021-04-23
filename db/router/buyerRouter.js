const express = require("express");
const router = express.Router();
const Buyer = require("@model/buyerModel");
const verificationCodeModel = require("@model/verificationCodeModel");
const commodityModel = require("@model/commodityModel");
const updateVerificationCode = require("@utils/updateVerificationCode");
const loginCookie = require("@utils/loginCookie");
const commodityClassification = require("@data/commodityClassification");

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
    .then(async (response) => {
      if (!response.length) {
        res.send({ code: -2, msg: "登陆失败，账号或密码错误" });
        return;
      }
      const loginToken = await loginCookie.getLoginCookie(loginNumber, 1);

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

router.post("/logout", (req, res) => {
  const { loginNumber } = req.body;
  if (!loginNumber) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  Buyer.find({
    $or: [
      {
        loginNumber,
      },
      {
        mailBox: loginNumber,
      },
    ],
  })
    .then((response) => {
      console.log("退出");
      console.log("response");
      console.log(response);
      if (!response.length) {
        res.send({ code: -2, msg: "退出失败" });
        return;
      }
      res.clearCookie("token", { path: "/" });
      res.send({ code: 0, msg: "退出成功" });
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
      res.send({ code: -2, msg: "此邮箱已被注册，请找回密码" });
      return;
    }
    const findLoginNumber = await Buyer.find({
      loginNumber,
    });
    if (findLoginNumber.length) {
      res.send({ code: -2, msg: "此账号已存在，请找回密码" });
      return;
    }

    verificationCodeModel.find({ mailBox }).then((response) => {
      if (!response.length) {
        res.send({ code: -2, msg: "邮箱验证码不正确" });
        return;
      }
      const { codeNumber, time } = response[0];

      if (codeNumber !== verificationCode) {
        res.send({ code: -2, msg: "邮箱验证码不正确" });
      } else if (Date.now() - time >= 300000) {
        res.send({ code: -2, msg: "邮箱验证码失效" });
      } else {
        Buyer.insertMany({ loginNumber, passWord, buyerName, mailBox })
          .then(async () => {
            const loginToken = await loginCookie.getLoginCookie(loginNumber, 1);
            res.cookie("token", loginToken, { path: "/" });
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

router.get("/getCommodity", async (req, res) => {
  const { classificationNumber } = req.query;
  if (!classificationNumber) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    if (classificationNumber != -1) {
      const findObj = {
        classificationNumber,
      };
      commodityModel
        .find(findObj)
        .then((response) => {
          const resData = handleCommodity(response);
          res.send({ code: 0, msg: "查询成功", content: resData });
        })
        .catch((err) => {
          console.log(err);
          res.send({ code: -2, msg: "查询失败" });
        });
      return;
    }
    commodityModel
      .find()
      .then((response) => {
        const resData = handleCommodity(response);
        res.send({ code: 0, msg: "查询成功", content: resData });
      })
      .catch((err) => {
        console.log(err);
        res.send({ code: -2, msg: "查询失败" });
      });
  } catch (err) {
    console.log(err);
    res.send({ code: -1, msg: "查询失败" });
  }
});

router.get("/getClassification", async (req, res) => {
  try {
    commodityModel
      .find()
      .then((response) => {
        const resData = getClassification(response);
        res.send({ code: 0, msg: "查询成功", content: resData });
      })
      .catch((err) => {
        console.log(err);
        res.send({ code: -2, msg: "查询失败" });
      });
  } catch (err) {
    console.log(err);
    res.send({ code: -1, msg: "查询失败" });
  }
});

module.exports = router;

function handleCommodity(dataArray) {
  const arr = dataArray;
  if (!arr.length) {
    return;
  }
  const response = {};
  Object.keys(commodityClassification.classification).forEach((key) => {
    response[key] = arr.filter((item) => item.classificationNumber == key);
  });
  return response;
}

function getClassification(dataArray) {
  const arr = dataArray;
  if (!arr.length) {
    return;
  }
  const classification = {};
  Object.keys(commodityClassification.classification).forEach((key) => {
    const have = arr.some((item) => item.classificationNumber == key);
    if (have) {
      classification[key] = {
        label: commodityClassification.classification[key],
        key,
      };
    }
  });
  const response = {
    classification,
    vagueClassification: commodityClassification.vagueClassification,
  };
  return response;
}
