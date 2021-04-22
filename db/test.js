const Order = require("./model/orderModel");
const Commodity = require("./model/commodityModel");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/sallsystem", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", (err) => {
  console.log("mongoose 出错 ");
  console.log(err);
});
db.on("open", () => {
  console.log("mongoose 连接成功 ");
});
function insertCommodity() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const status = Math.floor(Math.random() * 8);
    const goCourierNumber = status === 0 ? "" : "1234213145123";
    const backCourierNumber = [0, 1, 2].includes(status)
      ? ""
      : "1232222222222222222";
    data.push({
      commodityNumber: i,
      commodityName: "手术刀",
      actualValue: 12,
      commodityCount: 22,
      actualPayment: 11,
      sallerId: "607f996c3ac4961fe0d86e2f",
      sallerName: "2whp",
      buyerId: "1234512315123",
      buyerName: "3whp",
      orderStatus: status,
      setTime: Date.now(),
      goCourierNumber,
      backCourierNumber,
    });
  }

  Commodity.insertMany(data)
    .then((response) => {
      console.log(response.length);
    })
    .catch((err) => {
      console.log("错误");
      console.log(err);
    });
  Commodity.in;
}
function insertOrders() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const status = Math.floor(Math.random() * 8);
    const goCourierNumber = status === 0 ? "" : "1234213145123";
    const backCourierNumber = [0, 1, 2].includes(status)
      ? ""
      : "1232222222222222222";
    data.push({
      orderNumber: i,
      commodityId: i,
      commodityName: "手术刀",
      actualValue: 12,
      commodityCount: 22,
      actualPayment: 11,
      sallerId: "607f996c3ac4961fe0d86e2f",
      sallerName: "2whp",
      buyerId: "1234512315123",
      buyerName: "3whp",
      orderStatus: status,
      setTime: Date.now(),
      goCourierNumber,
      backCourierNumber,
    });
  }

  Order.insertMany(data)
    .then((response) => {
      console.log(response.length);
    })
    .catch((err) => {
      console.log("错误");
      console.log(err);
    });
}
