const vagueClassification = [
  [{ title: "手术器械", detailClasification: [0, 1, 2, 3] }],
  [
    { title: "成像检测治疗", detailClasification: [4, 5, 6, 7, 8, 20, 19] },
    { title: "眼口治疗", detailClasification: [14, 15] },
  ],
  [
    { title: "护理保护", detailClasification: [12, 13] },
    { title: "中医生理", detailClasification: [17, 16] },
  ],
  [
    { title: "植入器械", detailClasification: [10, 11] },
    { title: "其它", detailClasification: [9, 18] },
  ],
];

const classification = {
  0: "有源手术器械",
  1: "无源手术器械",
  2: "神经和心血管手术器械",
  3: "骨科手术器械",
  4: "放射治疗器械",
  5: "医用成像器械",
  6: "医用诊察和监护器械",
  7: "呼吸、麻醉和急救器械",
  8: "输血、透析和体外循环器械",
  9: "医疗器械消毒灭菌器械",
  10: "有源植入器械",
  11: "无源植入器械",
  12: "注输、护理和防护器械",
  13: "患者承载器械",
  14: "眼科器械",
  15: "口腔科器械",
  16: "妇产科、辅助生殖和避孕器械",
  17: "中医器械",
  18: "医用软件",
  19: "临床检验器械",
  20: "物理治疗器械",
};
vagueClassification.forEach((item) => {
  item.forEach((ele) => {
    ele.label = ele.detailClasification.map((curItem) => {
      return classification[curItem];
    });
  });
});
module.exports = {
  classification,
  vagueClassification,
};
