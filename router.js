const express = require("express");
const router = express.Router();
const db = require("./models/db");

const userController = require("./controllers/user");
const topicController = require("./controllers/topic");
const commentController = require("./controllers/comment");
const sessionController = require("./controllers/session");

// 校验登陆状态  利用中间件的方式 路由可以添加多个中间件
function checkLogin(req, res, next) {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized "
    });
  }
  next();
}

// 校验删除和修改资源的用户是否与真实的所有者一致
async function checkTopic(req, res, next) {
  try {
    const { id } = req.params;
    // 验证所删除的id是否存有当前用户的user_id
    const [topic] = await db.query(`select * from topics where id=${id}`);
    // 指定id的topic不存在
    if (!topic) {
      return res.status(404).json({
        erro: "NOT FOUND"
      });
    }
    // 指定topic与当前用户不符合
    if (req.session.user.id !== topic.user_id) {
      return res.status(400).json({
        erro: "INVALID REQUEST"
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

// 用户管理
router
  .get("/users", userController.listUser)
  .post("/users", userController.creatUser)
  .patch("/users/:id", userController.updateUser)
  .delete("/users/:id", userController.destroyUser);

// 话题管理
router
  .get("/topics", topicController.listTopic)
  .get("/topics/listOne/:id", topicController.listOne)
  .post("/topics", checkLogin, topicController.creatTopic)
  .patch("/topics/:id", checkLogin, checkTopic, topicController.updateTopic)
  .delete("/topics/:id", checkLogin, checkTopic, topicController.deleteTopic);

// 评论管理
router
  .get("/comments", commentController.listComment)
  .post("/comments", checkLogin, commentController.creatComment)
  .patch("/comments/:id", checkLogin, commentController.updateComment)
  .delete("/comments/:id", checkLogin, commentController.destroyComment);

// 会话管理
router
  .get("/session", checkLogin, sessionController.getSession)
  .post("/session", sessionController.creatSession)
  .delete("/session", sessionController.destroySession);

module.exports = router;
