module.exports = function (cookie, item) {
  const reg = new RegExp(`(?:(?:^|.*;\s*)${item}\s*\=\s*([^;]*).*$)|^.*$`);
  return unescape(cookie.replace(reg, "$1"));
};
