const express = require("express");
const bodyparser = require("body-parser");
const buyerRouter = require("@router/buyerRouter");
const sallerRouter = require("@router/sallerRouter");
const sendVerificationCode = require("@router/verificationCodeRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("@db/connect");
const app = express();

const port = 3000;

// 解析表单数据 x-www-form-urlencode
app.use(bodyparser.urlencoded({ extended: false }));
// 解析json
app.use(bodyparser.json());
// app.use(cors());

// 加入cookie-parser中间件
app.use(cookieParser());

// 引入路由
app.use("/buyer", buyerRouter);
app.use("/saller", sallerRouter);

// 邮箱验证码
app.get("/getVerificationCode", (req, res) => {
  sendVerificationCode(req, res);
});
// 邀请码
app.get("/getInvitationCode", (req, res) => {
  sendVerificationCode(req, res);
});

app.listen(port, () => {
  console.log("server start !");
});
