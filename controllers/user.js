const md5 = require("blueimp-md5");
const moment = require("moment");
const db = require("../models/db.js");
const sqlHelper = require("../utilities/sqlhelper.js");

exports.listUser = async (req, res, next) => {
  try {
    console.log(req.query);
    const andConditionStr = sqlHelper.andConditionStr(req.query);
    const user = await db.query(`select * from users where ${andConditionStr}`);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.creatUser = async (req, res, next) => {
  // express 无法获取post提交的数据，需要安装 body-parser
  const body = req.body;
  const sqlStr = `insert into users
  (
    username,
    password,
    email,
    avatar,
    gender,
    create_time,
    modify_time,
    nickname
  )
  values
  (
    '${body.email}',
    '${md5(md5(body.password))}',
    '${body.email}',
    'default-avatar.png',
    0,
    '${moment().format("YYYY-MM-DD hh:mm:ss")}',
    '${moment().format("YYYY-MM-DD hh:mm:ss")}',
    '${body.nickname}')`;

  try {
    const ret = await db.query(sqlStr);
    const user = await db.query(
      `select * from users where id='${ret.insertId}'`
    );
    res.status(201).json(user[0]);
  } catch (err) {
    return next(err);
  }
};

exports.updateUser = (req, res, next) => {};

exports.destroyUser = (req, res, next) => {};
