const CryptoJS = require("crypto-js");

const crypto = {
  // 密钥
  key: "sall-system-1123",
  /**
   * @description: 加密data
   * @param {*} data 要加密的数据
   * @param {string} key 密钥
   * @return {string} 不知道
   * @author: wuhaipeng
   */
  encrypte: function (data, key = this.key) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: CryptoJS.enc.Utf8.parse(""),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  /**
   * @description: 解密
   * @param {string} code AES加密码
   * @param {string} key 密钥
   * @return {*} data
   * @author: wuhaipeng
   */
  decrypte: function (code, key = this.key) {
    const decrypted = CryptoJS.AES.decrypt(code, key, {
      iv: CryptoJS.enc.Utf8.parse(""),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  },
};

module.exports = crypto;
