"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function mailSender(mailBox, code) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // 测试 不用使用真实邮箱测试
  let testAccount = await nodemailer.createTestAccount();

  // 发送方配置
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // 发送方邮箱
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "1370099717@qq.com",
      //  发送方邮箱地址
      pass: "rotyakstwdhvhbhf",
      // mtp验证码  邮箱-> 账户 ->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务 ->IMAP/SMTP服务 开启
    },
  });

  // 邮件信息
  let sendOptions = {
    from: '"医疗用品销售系统后端" <1370099717@qq.com>', // 发送方地址
    to: `<${mailBox}>`, // 可同时发送多个邮箱
    subject: "医疗用品销售系统注册验证码", // 邮件标题
    text: "Hello world?", // plain text body
    html: `<span><b>【医疗用品销售】</b>您的<b>验证码</b>为${code}，有效期五分钟</span>`,
    // html body
  };
  await transporter.sendMail(sendOptions);
}

// mailSender(1111)
//   .then(() => {
//     console.log("发送成功");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = mailSender;
