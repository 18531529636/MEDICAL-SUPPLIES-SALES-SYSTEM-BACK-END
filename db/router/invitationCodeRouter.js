const maildSender = require("@utils/mailer");
const updateVerificationCode = require("@utils/updateVerificationCode");

function sendCode(req, res) {
  const { mailBox } = req.query;
  if (!mailBox) {
    res.send({ code: -1, msg: "参数为空" });
    return;
  }
  try {
    const codeNumber = (Math.random() * 100000).toString().substr(0, 4);
    maildSender(mailBox, codeNumber, 1).then(() => {
      console.log("成功发送邀请码");
      console.log(codeNumber);
      updateVerificationCode(mailBox, codeNumber, Date.now());
      res.send({ code: 0, msg: `${mailBox} 邀请功`, codeNumber });
    });

    // console.log("成功发送邀请码");
    // console.log(codeNumber);
    // updateVerificationCode(mailBox, codeNumber, Date.now());
    // res.send({ code: 0, msg: `${mailBox} 邀请码发送成功`, codeNumber });
  } catch (err) {
    console.log(err);
  }
}
module.exports = sendCode;
