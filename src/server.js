const express = require("express");
const bodyparser = require("body-parser");
const buyerRouter = require("../db/router/buyerRouter");
require("../db/connect");
const app = express();

const port = 3000;

// 解析表单数据 x-www-form-urlencode
app.use(bodyparser.urlencoded({ extended: false }));
// 解析json
app.use(bodyparser.json());
// 引入路由

app.use("/buyer", buyerRouter);
app.listen(port, () => {
  console.log("server start !");
});
