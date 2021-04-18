const verificationCode = require("../model/verificationCodeModel");

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
module.exports = updateVerificationCode;
