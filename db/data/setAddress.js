const fs = require("fs");
const {
  data,
  province,
  city,
  area,
  town,
} = require("province-city-china/data");

const address = province;

function setLabel(arr) {
  arr.forEach((item) => {
    item.label = item.name;
    item.value = item.code;
    item.children = [];
  });
}

setLabel(data);
setLabel(province);
setLabel(city);
setLabel(area);
setLabel(town);

// 市
address.forEach((item) => {
  city.forEach((ele) => {
    if (ele.province === item.province) {
      item.children.push(ele);
    }
  });
});

// 县
address.forEach((e) => {
  if (e.children.length) {
    e.children.forEach((item) => {
      area.forEach((ele) => {
        if (ele.city === item.city) {
          item.children.push(ele);
        }
      });
    });
  }
});
console.log(town.length);

// 街道
address.forEach((e) => {
  if (e.children.length) {
    e.children.forEach((a) => {
      if (a.children.length) {
        a.children.forEach((item) => {
          town.forEach((ele) => {
            if (ele.area === item.area) {
              item.children.push(ele);
            }
          });
        });
      }
    });
  }
});
// console.log(address);
const dataJson = JSON.stringify(address);

fs.writeFile("address.json", dataJson, function (err) {
  if (err) {
    console.log(err);
    console.log("写入失败");
    return;
  }
  console.log("写入完毕");
});
