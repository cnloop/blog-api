const db = require("../models/db.js");
const moment = require("moment");

exports.listComment = async (req, res, next) => {
  const { article_id } = req.query;
  const sqlStr = `select * from comments where article_id=${article_id}`;
  const comments = await db.query(sqlStr);
  res.status(200).json(comments);
};

exports.creatComment = async (req, res, next) => {
  try {
    const { content, article_id } = req.body;
    const user_id = req.session.user.id;
    const create_time = moment().format("YYYY-MM-DD hh:mm:ss");
    const modify_time = moment().format("YYYY-MM-DD hh:mm:ss");
    const sqlStr = `insert into comments (content,create_time,modify_time,article_id,user_id,reply_id)
    values 
    (
        '${content}',
        '${create_time}',
        '${modify_time}',
        '${article_id}',
        '${user_id}',
        null
    )`;
    const ret = await db.query(sqlStr);
    const [comment] = await db.query(
      `select * from comments where id=${ret.insertId}`
    );
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.updateComment = (req, res, next) => {};

exports.destroyComment = (req, res, next) => {};
