const moment = require("moment");
const db = require("../models/db.js");

exports.listTopic = async (req, res, next) => {
  try {
    console.log(req.query);
    let { _page = 1, _limit = 10 } = req.query;
    if (_page < 1) _page = 1;
    if (_limit < 1 || _limit > 30) _limit = 30;
    let start = (_page - 1) * _limit;
    const sqlStr = `select * from topics limit ${start},${_limit}`;
    const topics = await db.query(sqlStr);
    const [{ retCount }] = await db.query(
      `select count(*) as retCount from topics`
    );
    let pageCount = Math.ceil(retCount / _limit);
    res.status(200).json({ topics, pageCount });
  } catch (err) {
    next(err);
  }
};

exports.listOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(req.params);
    const sqlStr = `select * from topics where id=${id}`;
    const topics = await db.query(sqlStr);
    res.status(200).json(topics[0]);
  } catch (err) {
    next(err);
  }
};

exports.creatTopic = async (req, res, next) => {
  // 检查是否有权限
  const id = req.session.user.id;
  const body = req.body;
  const create_time = moment().format("YYYY-MM-DD hh:mm:ss");
  const modify_time = moment().format("YYYY-MM-DD hh:mm:ss");

  const sqlStr = `insert into topics 
  (
    title,
    content,
    user_id,
    create_time,
    modify_time
  )
  values 
  (
    '${body.title}',
    '${body.content}',
    '${id}',
    '${create_time}',
    '${modify_time}'
  )`;
  try {
    const ret = await db.query(sqlStr);
    const [topic] = await db.query(
      `select * from topics where id=${ret.insertId}`
    );
    res.status(201).json(topic);
  } catch (err) {
    next(err);
  }
};

exports.updateTopic = async (req, res, next) => {
  try {
    const body = req.body;
    const { id } = req.params;
    const modify_time = moment().format("YYYY-MM-DD hh:mm:ss");
    const sqlStr = `update topics set title='${body.title}', content='${
      body.content
    }', modify_time='${modify_time}' where id=${id}`;
    await db.query(sqlStr);
    const [topic] = await db.query(`select * from topics where id=${id}`);
    res.status(201).json([topic]);
  } catch (err) {
    next(err);
  }
};

exports.deleteTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query(`delete from topics where id=${id}`);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};
