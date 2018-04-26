const session = require("express-session");
const db = require("../models/db");
const md5 = require("blueimp-md5");

// 获取会话
exports.getSession = (req, res, next) => {
  try {
    const user = req.session.user;
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// 创建会话，用户登陆
exports.creatSession = async (req, res, next) => {
  const body = req.body;
  const pwd = md5(md5(body.password));
  console.log(body);
  const sql = `select * from users where username='${
    body.username
  }' and password='${pwd}'`;
  try {
    const [user] = await db.query(sql);
    if (!user) {
      return res.status(404).json({
        message: "NOT FOUND!"
      });
    }
    req.session.user = user;
    res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
};

// 销毁会话，用户退出登陆
exports.destroySession = (req, res, next) => {
  req.session.destroy(err => {
    if (err) return next(err);
    res.status(201).json({}); // 返回一个空文档
  });
};
