const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/sallsystem", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log("mongoose 出错 ");
  console.log(err);
});

db.on("open", () => {
  console.log("mongoose 连接成功 ");
});
