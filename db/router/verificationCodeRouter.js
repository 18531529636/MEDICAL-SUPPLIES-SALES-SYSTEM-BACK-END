const verificationCode = require("../model/verificationCodeModel");
const maildSender = require("../utils/mailer");

function updateVerificationCode(mailBox, codeNumber, time) {
  return new Promise((resolve, reject) => {
    verificationCode
      .find({ mailBox })
      .then(async (response) => {
        if (!response.length) {
          await verificationCode
            .insertMany({ mailBox, codeNumber, time })
            .then(() => {
              resolve();
            })
            .catch((err) => {
              console.log("邮箱验证码insert数据库错误");
              console.log(err);
              reject(err);
            });
        } else {
          await verificationCode
            .findOneAndUpdate(
              { mailBox: response[0].mailBox },
              {
                $set: { codeNumber, time },
              }
            )
            .then(() => {
              resolve();
            })
            .catch((err) => {
              console.log("邮箱验证码update数据库错误");
              console.log(err);
              reject(err);
            });
        }
      })
      .catch((err) => {
        console.log("邮箱验证码find数据库错误");
        console.log(err);
        reject(err);
      });
  });
}

function sendCode(req, res) {
  const { mailBox } = req.query;
  if (!mailBox) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    const codeNumber = (Math.random() * 100000).toString().substr(0, 4);
    // maildSender(mailBox, codeNumber).then(() => {
    //   console.log("成功发送邮箱验证码");
    //   console.log(codeNumber);
    //   updateVerificationCode(mailBox, codeNumber, Date.now());
    //   res.send({ code: 0, msg: `${mailBox} 邮箱验证码发送成功`, codeNumber });
    // });
    
    console.log("成功发送邮箱验证码");
    console.log(codeNumber);
    updateVerificationCode(mailBox, codeNumber, Date.now());
    res.send({ code: 0, msg: `${mailBox} 邮箱验证码发送成功`, codeNumber });
  } catch (err) {
    console.log(err);
  }
}
module.exports = sendCode;
