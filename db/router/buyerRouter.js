const express = require("express");
const router = express.Router();
const BuyerModel = require("@model/buyerModel");
const SallerModel = require("@model/sallerModel");
const VerificationCodeModel = require("@model/verificationCodeModel");
const CommodityModel = require("@model/commodityModel");
const OrderModel = require("@model/orderModel");
const CartModel = require("@model/cartModel");
const AddressModel = require("@model/addressModel");
const updateVerificationCode = require("@utils/updateVerificationCode");
const loginCookie = require("@utils/loginCookie");
const buyerUtils = require("./buyerUtils");
const { response } = require("express");

global.verificationCodeData = {};

router.post("/search", (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  const reg = new RegExp(keyword);
  const isNumber = !isNaN(Number(keyword));
  const searchCondition = [
    {
      commodityNumber: {
        $regex: reg,
      },
    },
    {
      commodityName: {
        $regex: reg,
      },
    },
    {
      introduction: {
        $regex: reg,
      },
    },
    {
      marketValue: {
        $regex: reg,
      },
    },
    {
      memberValue: {
        $regex: reg,
      },
    },
    {
      sallerId: {
        $regex: reg,
      },
    },
    {
      sallerName: {
        $regex: reg,
      },
    },
    {
      sallerPhone: {
        $regex: reg,
      },
    },
    {
      classificationName: {
        $regex: reg,
      },
    },
  ];
  if (isNumber) {
    searchCondition.push({
      classificationNumber: {
        $regex: reg,
      },
    });
  }
  CommodityModel.find({ $or: searchCondition })
    .then((response) => {
      if (!response.length) {
        res.send({ code: -2, msg: "查找失败" });
        return;
      }
      const resData = buyerUtils.handleCommodity(response);
      res.send({ code: 0, msg: "成功", content: resData });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: "数据查询错误！" });
    });
});

router.post("/login", (req, res) => {
  const { loginNumber, passWord } = req.body;
  if (!loginNumber || !passWord) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  BuyerModel.find({
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
        res.cookie("buyerToken", loginToken, { path: "/" });
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
  BuyerModel.find({
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

router.post("/getUserInfo", async (req, res) => {
  const { loginNumber, mailBox } = req.body;
  if (!loginNumber || !mailBox) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  const userInfo = {};
  try {
    const buyerInfo = await BuyerModel.find({ loginNumber });
    userInfo.buyerName = buyerInfo[0].buyerName;
    userInfo.buyerId = buyerInfo[0]._id;
    userInfo.buyerNumber = loginNumber;
    res.send({ code: 0, msg: "成功", content: userInfo });
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  const {
    loginNumber,
    verificationCode,
    buyerName,
    passWord,
    mailBox,
    address,
  } = req.body;
  if (
    !loginNumber ||
    !passWord ||
    !buyerName ||
    !mailBox ||
    !verificationCode ||
    !address
  ) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    const findMailBox = await BuyerModel.find({
      mailBox,
    });
    if (findMailBox.length) {
      res.send({ code: -2, msg: "此邮箱已被注册，请找回密码" });
      return;
    }
    const findLoginNumber = await BuyerModel.find({
      loginNumber,
    });
    if (findLoginNumber.length) {
      res.send({ code: -2, msg: "此账号已存在，请找回密码" });
      return;
    }

    VerificationCodeModel.find({ mailBox }).then((response) => {
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
        BuyerModel.insertMany({ loginNumber, passWord, buyerName, mailBox })
          .then(async () => {
            const loginToken = await loginCookie.getLoginCookie(loginNumber, 1);
            res.cookie("buyerToken", loginToken, { path: "/" });
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

router.post("/setAddress", async (req, res) => {
  const {
    loginNumber,
    province,
    city,
    country,
    town,
    detailedAddress,
    receivePeople,
    receivePhone,
  } = req.body;
  if (
    !loginNumber ||
    !province ||
    !city ||
    !country ||
    !town ||
    !detailedAddress ||
    !receivePeople ||
    !receivePhone
  ) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  const findAddress = await AddressModel.find();
  let defaultChoose = false;
  if (!findAddress.length) {
    defaultChoose = true;
  }
  AddressModel.insertMany({
    addressNumber: findAddress.length,
    loginNumber,
    province,
    city,
    country,
    town,
    detailedAddress,
    receivePeople,
    receivePhone,
    defaultChoose,
  })
    .then((response) => {
      console.log(response);
      if (!response) {
        res.send({ code: -2, msg: "失败" });
        return;
      }
      res.send({ code: 0, msg: "新建收货地址成功" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: "失败" });
    });
});

router.post("/getAddress", (req, res) => {
  const { loginNumber } = req.body;
  if (!loginNumber) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  AddressModel.find({
    loginNumber,
  })
    .then((response) => {
      if (!response) {
        res.send({ code: -2, msg: "失败" });
        return;
      }
      response.sort((pre, next) => next.defaultChoose - pre.defaultChoose);
      res.send({ code: 0, msg: "成功", content: response });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: "失败" });
    });
});

router.post("/setDefaultAddress", async (req, res) => {
  try {
    const { loginNumber, addressNumber } = req.body;
    if (!loginNumber || !addressNumber) {
      res.send({ code: -1, msg: "参数为空" });
      return;
    }
    const findAddressList = await AddressModel.find({
      loginNumber,
    });

    findAddressList.forEach(async (item) => {
      if (item.addressNumber == addressNumber) {
        await AddressModel.findOneAndUpdate(
          {
            addressNumber: item.addressNumber,
            loginNumber,
          },
          { $set: { defaultChoose: true } }
        );
        return;
      }
      await AddressModel.findOneAndUpdate(
        {
          addressNumber: item.addressNumber,
          loginNumber,
        },
        { $set: { defaultChoose: false } }
      );
    });
    res.send({ code: 0, msg: "成功" });

    // findAddressList.some(async (item) => {
    //   if (item.defaultChoose) {
    //     AddressModel.findOneAndUpdate(
    //       {
    //         addressNumber: item.addressNumber,
    //         loginNumber,
    //       },
    //       { $set: { defaultChoose: false } }
    //     ).then(async () => {
    //       AddressModel.findOneAndUpdate(
    //         {
    //           addressNumber: addressNumber,
    //           loginNumber,
    //         },
    //         { $set: { defaultChoose: false } }
    //       ).then(() => {
    //         res.send({ code: 0, msg: "成功" });
    //       });
    //     });
    //     return true;
    //   }
    //   return false;
    // });
  } catch (err) {
    console.log(err);
    res.send({ code: -1, msg: "失败" });
  }
});

router.post("/deleteAddress", async (req, res) => {
  try {
    const { loginNumber, addressNumber } = req.body;
    if (!loginNumber || !addressNumber) {
      res.send({ code: -1, msg: "参数为空" });
      return;
    }
    await AddressModel.deleteOne({
      loginNumber,
      addressNumber,
    });
    res.send({ code: 0, msg: "成功" });
  } catch (err) {
    console.log(err);
    res.send({ code: -1, msg: "失败" });
  }
});

router.post("/addCart", async (req, res) => {
  const { buyerId, commodityNumber, sallerId } = req.body;
  if (!buyerId || !commodityNumber || !sallerId) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    const cartfindResp = await CartModel.find({ commodityNumber });
    if (!!cartfindResp.length) {
      const updateResp = await CartModel.findByIdAndUpdate(
        cartfindResp[0]._id,
        {
          $set: {
            updateTime: Date.now(),
            commodityCount: cartfindResp[0].commodityCount + 1,
            commodityTotalValue:
              (cartfindResp[0].commodityCount + 1) *
              cartfindResp[0].memberValue,
          },
        }
      );
      res.send({ code: 0, msg: "添加成功", content: updateResp });
      return;
    }
    const obj = {};
    const commodityResponse = await CommodityModel.find({ commodityNumber });
    if (!commodityResponse.length) {
      res.send({ code: 0, msg: "没有该商品" });
      return;
    }
    obj.commodityNumber = commodityNumber;
    obj.commodityCount = 1;
    obj.commodityName = commodityResponse[0].commodityName;
    obj.commodityImgUrl = commodityResponse[0].commodityImgUrl;
    obj.introduction = commodityResponse[0].introduction;
    obj.marketValue = commodityResponse[0].marketValue;
    obj.memberValue = commodityResponse[0].memberValue;
    obj.classificationNumber = commodityResponse[0].classificationNumber;
    obj.classificationName = commodityResponse[0].classificationName;
    obj.commodityTotalValue = obj.commodityCount * obj.memberValue;

    const sallerResponse = await SallerModel.findById(sallerId);
    if (!sallerResponse) {
      res.send({ code: 0, msg: "没有该商家" });
      return;
    }
    obj.sallerId = sallerId;
    obj.sallerName = sallerResponse.sallerName;
    obj.sallerPhone = sallerResponse.phoneNumber;
    obj.updateTime = Date.now();
    const cartResponse = await CartModel.find();
    obj.cartNumber = `${cartResponse.length}`;
    obj.buyerId = buyerId;
    console.log(obj);
    CartModel.insertMany(obj)
      .then((response) => {
        res.send({ code: 0, msg: "添加成功", content: response[0] });
      })
      .catch((err) => {
        console.log(err);
        res.send({ code: -2, msg: "添加失败" });
      });
  } catch (err) {
    console.log(err);
    res.send({ code: -1, msg: "添加失败" });
  }
});

router.post("/getCart", async (req, res) => {
  const { buyerId } = req.body;
  if (!buyerId) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    CartModel.find({ buyerId })
      .then((response) => {
        res.send({ code: 0, msg: "查询成功", content: response });
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

router.post("/getCartDetail", async (req, res) => {
  const { buyerId, cartNumberList } = req.body;
  if (!buyerId || !cartNumberList || !cartNumberList.length) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  const findCondition = cartNumberList.map((item) => {
    return {
      buyerId,
      cartNumber: item,
    };
  });
  try {
    CartModel.find({ $or: findCondition })
      .then((response) => {
        res.send({ code: 0, msg: "查询成功", content: response });
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

router.post("/deleteCart", async (req, res) => {
  const { cartNumber, deleteCount } = req.body;
  if (!cartNumber || !deleteCount) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    if (deleteCount === -1) {
      CartModel.deleteOne({ cartNumber })
        .then(() => {
          res.send({ code: 0, msg: "删除成功" });
        })
        .catch((err) => {
          console.log(err);
          res.send({ code: -2, msg: "删除失败" });
        });
      return;
    }
    const updateResp = await CartModel.findAndUpdate(
      { cartNumber },
      {
        $set: {
          updateTime: Date.now(),
          commodityCount: cartfindResp[0].commodityCount - deleteCount,
          commodityTotalValue:
            (cartfindResp[0].commodityCount + 1) * cartfindResp[0].memberValue,
        },
      }
    );
    res.send({ code: -2, msg: "删除失败" });
  } catch (err) {
    console.log(err);
    res.send({ code: -1, msg: "删除失败" });
  }
});

router.post("/setCourierNumber", (req, res) => {
  const { buyerId, orderNumber, courierNumber } = req.body;
  if (!buyerId || !orderNumber || !courierNumber) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  OrderModel.findOneAndUpdate(
    { buyerId, orderNumber },
    { $set: { backCourierNumber: courierNumber, commodityStatus: 6 } }
  )
    .then((response) => {
      console.log(response);
      if (!response) {
        res.send({ code: -2, msg: "失败" });
        return;
      }
      res.send({ code: 0, msg: "退货订单快递单号更新成功" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: -1, msg: "失败" });
    });
});

router.post("/setOrder", async (req, res) => {
  try {
    const { commodityList, receivingAddress, buyerId } = req.body;
    if (
      !commodityList ||
      !receivingAddress ||
      !buyerId ||
      !commodityList.length
    ) {
      res.send({ code: -1, msg: "参数为空" });
      return;
    }
    const searchCondition = commodityList.map((item) => {
      return {
        buyerId,
        cartNumber: item,
      };
    });
    const buyerInfo = await BuyerModel.findById(buyerId);
    const orderList = await OrderModel.find();
    const cartOrderList = await CartModel.find({ $or: searchCondition });
    // searchCondition.forEach(async (item) => {
    //   await CartModel.deleteOne(item);
    // });
    console.log(buyerInfo);
    const insertCommodityList = cartOrderList.map((item, index) => {
      return {
        commodityStatus: "0",
        commodityNumber: item.commodityNumber,
        commodityCount: item.commodityNumber,
        commodityName: item.commodityName,
        commodityImgUrl: item.commodityImgUrl,
        commodityTotalValue: item.commodityTotalValue,
        introduction: item.introduction,
        marketValue: item.marketValue,
        memberValue: item.memberValue,
        classificationNumber: item.classificationNumber,
        classificationName: item.classificationName,
        sallerId: item.sallerId,
        sallerName: item.sallerName,
        sallerPhone: item.sallerPhone,
        goCourierNumber: "",
        backCourierNumber: "",
        orderNumber: orderList.length + index,
        temporary: true,
        temporaryNumber: orderList.length,
        buyerId,
        buyerName: buyerInfo.buyerName,
        buyerPhone: buyerInfo.phoneNumber,
        receivingAddress,
        updateTime: Date.now(),
      };
    });

    const insertOrderReps = await OrderModel.insertMany(insertCommodityList);
    res.send({ code: 0, msg: "成功", orderList: insertOrderReps });
    // res.send({ code: 0, msg: "成功", orderList: insertOrderReps });
    // const insertCommodityList = cartOrderList.map((item) => {
    //   return {
    //     commodityStatus: "0",
    //     commodityNumber: item.commodityNumber,
    //     commodityCount: item.commodityNumber,
    //     commodityName: item.commodityName,
    //     commodityImgUrl: item.commodityImgUrl,
    //     commodityTotalValue: item.commodityTotalValue,
    //     introduction: item.introduction,
    //     marketValue: item.marketValue,
    //     memberValue: item.memberValue,
    //     classificationNumber: item.classificationNumber,
    //     classificationName: item.classificationName,
    //     sallerId: item.sallerId,
    //     sallerName: item.sallerName,
    //     sallerPhone: item.sallerPhone,
    //     goCourierNumber: "",
    //     backCourierNumber: "",
    //   };
    // });
    // const sallerClassifycaton = [];
    // insertCommodityList.forEach((item) => {
    //   if (!sallerClassifycaton.includes(item.sallerId)) {
    //     sallerClassifycaton.push(item.sallerId);
    //   }
    // });
    // const insertOrderList = sallerClassifycaton.map((item, index) => {
    //   const commodityList = insertCommodityList.filter(
    //     (ele) => ele.sallerId === item
    //   );
    //   const totalValue = commodityList.reduce((sum, item, index) => {
    //     return index === 1
    //       ? sum.commodityTotalValue + item.commodityTotalValue
    //       : sum + item.commodityTotalValue;
    //   });
    //   return {
    //     orderNumber: orderList.length + index,
    //     temporary: true,
    //     temporaryNumber: orderList.length,
    //     buyerId,
    //     buyerName: buyerInfo.buyerName,
    //     buyerPhone: buyerInfo.phoneNumber,
    //     receivingAddress,
    //     totalValue,
    //     commodityList,
    //     updateTime: Date.now(),
    //   };
    // });
  } catch (err) {
    console.log(err);
  }
});

router.post("/checkOrderPay", async (req, res) => {
  const { orderNumberList } = req.body;
  if (!orderNumberList || !orderNumberList.length) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    orderNumberList.forEach(async (item) => {
      await OrderModel.findOneAndUpdate(
        { orderNumber: item, temporary: true },
        { $set: { temporary: false } }
      );
    });
    res.send({ code: 0, msg: "成功" });
  } catch (err) {
    console.log(err);
    res.send({ code: -1, msg: "查询失败" });
  }
});

router.post("/getOrder", async (req, res) => {
  const { buyerId } = req.body;
  if (!buyerId) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    OrderModel.find({ buyerId, temporary: false })
      .then((response) => {
        res.send({ code: 0, msg: "查询成功", content: response });
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

router.post("/getTemporaryOrder", async (req, res) => {
  const { buyerId } = req.body;
  if (!buyerId) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    OrderModel.find({ buyerId, temporary: true })
      .then((response) => {
        res.send({ code: 0, msg: "查询成功", content: response });
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
      CommodityModel.find(findObj)
        .then((response) => {
          const resData = buyerUtils.handleCommodity(response);
          res.send({ code: 0, msg: "查询成功", content: resData });
        })
        .catch((err) => {
          console.log(err);
          res.send({ code: -2, msg: "查询失败" });
        });
      return;
    }
    CommodityModel.find()
      .then((response) => {
        const resData = buyerUtils.handleCommodity(response);
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
    CommodityModel.find()
      .then((response) => {
        const resData = buyerUtils.getClassification(response);
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
