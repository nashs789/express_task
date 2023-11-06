// routes/posts.route.js

const express = require("express");
const { Posts } = require("../models");
const router = express.Router();

// 게시글 생성
router.post('/posts', async (req, res) => {
  const { title, content, password } = req.body;
  console.log(title + "\n" + content + "\n" + password);
  const post = await Posts.create({ title, content, password });
  console.log("???");

  res.status(201).json({ data: post });
});


module.exports = router;