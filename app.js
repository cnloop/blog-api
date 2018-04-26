const express = require("express");
const router = require("./router");
const session = require("express-session");
// 引入 body-parser
var bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// app.get('/',(err,res)=>{
//     res.status(200).send('api server is running...')
// })

// 设置session
app.use(
  session({
    secret: "keyboard cat", // 加密处理
    resave: false,
    saveUninitialized: false, //是否默认分配session
    cookie: {}
  })
);

// 把路由应用到app中
app.use(router);

//统一处理500的错误
app.use((err, req, res, next) => {
  res.status(500).json({
    erro: err.message
  });
});

app.listen("3000", () => {
  console.log("App is runing...");
});
