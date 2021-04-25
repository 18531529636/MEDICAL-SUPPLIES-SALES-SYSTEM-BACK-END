const commodityClassification = require("@data/commodityClassification");

module.exports = {
  handleCommodity(dataArray) {
    const arr = dataArray;
    if (!arr.length) {
      return;
    }
    const response = {};
    Object.keys(commodityClassification.classification).forEach((key) => {
      response[key] = arr.filter((item) => item.classificationNumber == key);
    });
    return response;
  },
  getClassification(dataArray) {
    const arr = dataArray;
    if (!arr.length) {
      return;
    }
    const classification = [];
    Object.keys(commodityClassification.classification).forEach((key) => {
      const have = arr.some((item) => item.classificationNumber == key);
      if (have) {
        classification.push({
          label: commodityClassification.classification[key],
          key,
        });
      }
    });
    const response = {
      classification,
      vagueClassification: commodityClassification.vagueClassification,
    };
    return response;
  },
};
