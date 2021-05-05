const Order = require("../model/orderModel");
const Commodity = require("../model/commodityModel");
const mongoose = require("mongoose");
const commodityClassification = require("../data/commodityClassification");
const CartModel = require("../model/cartModel");
const BuyerModel = require("../model/buyerModel");
const SallerModel = require("../model/sallerModel");

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
    const classificationName = commodityClassification.classification[status];
    data.push({
      commodityNumber: `${i}`,
      commodityName: "手术刀",
      commodityCurrentCount: 22,
      commodityImgUrl: "2whp",
      introduction: "这是21健康烦恼时并不改变",
      marketValue: 22,
      memberValue: 11,
      sallerId: "6091fc3fc33f551690f486e0",
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
      mongoose.disconnect();
    })
    .catch((err) => {
      console.log("错误");
      console.log(err);
      mongoose.disconnect();
    });
  Commodity.in;
}

async function insertOrders() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const classificationStatus = Math.floor(Math.random() * 21);
    const classificationName =
      commodityClassification.classification[classificationStatus];
    const status = Math.floor(Math.random() * 8);
    const goCourierNumber = status === 0 ? "" : "1234213145123";
    const backCourierNumber = [0, 1, 2].includes(status)
      ? ""
      : "1232222222222222222";
    const commodities = await Commodity.find();
    const commodityIndex = Math.floor(Math.random() * (commodities.length - 2));
    const commodityLength = Math.floor(
      Math.random() * (commodities.length - 1 - commodityIndex)
    );
    const commodityList = commodities.filter(
      (item, index) =>
        index >= commodityIndex && index <= commodityLength + commodityIndex
    );
    data.push({
      orderNumber: i,
      orderStatus: status,
      buyerId: "6091fba16edee90a74b64046",
      buyerName: "3whp",
      buyerPhone: "145156445",
      receivingAddress: {
        province: "北京",
        city: "北京市",
        area: "大兴区",
        town: "西红门镇",
        detailAddress: "蜂窝公寓",
      },
      commodityList,
      updateTime: Date.now(),
    });
  }

  Order.insertMany(data)
    .then((response) => {
      console.log(response.length);
      mongoose.disconnect();
    })
    .catch((err) => {
      console.log("错误");
      console.log(err);
      mongoose.disconnect();
    });
}

function insertCart() {
  const data = [];
  for (let i = 0; i < 80; i++) {
    const count = Math.floor(Math.random() * 21);
    const value = 22;
    const totalValue = count * value;
    const status = Math.floor(Math.random() * 21);
    const classificationName = commodityClassification.classification[status];
    data.push({
      cartNumber: `${i}`,
      update: Date.now(),
      buyerId: "60826d776b13e31ca4b4bef9",
      commodityCount: count,
      commodityTotalValue: totalValue,
      commodityNumber: i,
      commodityName: "手术刀",
      commodityImgUrl: "2whp",
      introduction: "这是21健康烦恼时并不改变",
      marketValue: 22,
      memberValue: 11,
      sallerId: "60826ead8b586234906b1ef0",
      sallerName: "whp",
      sallerPhone: "4564648",
      classificationNumber: status,
      classificationName,
    });
  }

  CartModel.insertMany(data)
    .then((response) => {
      console.log(response.length);
      mongoose.disconnect();
    })
    .catch((err) => {
      console.log("错误");
      console.log(err);
      mongoose.disconnect();
    });
}

function insertBuyer() {
  BuyerModel.insertMany({
    buyer: "whp",
    phoneNumber: "3124213",
    loginNumber: "qwe",
    passWord: "a123456",
    mailBox: "12",
  })
    .then((response) => {
      console.log(response);
      console.log(response.length);
      mongoose.disconnect();
    })
    .catch((err) => {
      console.log("错误");
      console.log(err);
      mongoose.disconnect();
    });
}
function insertSaller() {
  SallerModel.insertMany({
    buyer: "whp",
    phoneNumber: "3124213",
    loginNumber: "qwe",
    passWord: "a123456",
    mailBox: "12",
  })
    .then((response) => {
      console.log(response);
      console.log(response.length);
      mongoose.disconnect();
    })
    .catch((err) => {
      console.log("错误");
      console.log(err);
      mongoose.disconnect();
    });
}
insertOrders();
