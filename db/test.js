const Order = require("./model/orderModel");
const Commodity = require("./model/commodityModel");
const mongoose = require("mongoose");
const commodityClassification = require("./data/commodityClassification");

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
  for (let i = 0; i < 200; i++) {
    // 0 1 2 3 4 5 6 7
    const status = Math.floor(Math.random() * 21);
    const classificationName = commodityClassification[status];
    data.push({
      commodityNumber: i,
      commodityName: "手术刀",
      commodityCurrentCount: 22,
      commodityImgUrl: "2whp",
      introduction: "这是21健康烦恼时并不改变",
      marketValue: 22,
      memberValue: 11,
      sallerId: "60826ead8b586234906b1ef0",
      sallerName: "whp",
      sallerPhone: "4564648",
      classificationNumber: status,
      classificationName,
      setTime: Date.now(),
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
      sallerId: "60826ead8b586234906b1ef0",
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
insertCommodity();
