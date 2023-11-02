const express = require('express');
const router = express.Router();

const Post = require("../schemas/post.js");
const Counter = require("../schemas/Counter.js")
const { NoData, InvalidUser } = require("../routes/Class/CustomError.js");

// 예외처리 미숙하게 되서 다시 한 번 잡아서 해야할듯 (일단 게시판 과제 먼저 끝내고)

router.get("/post", async(req, res) => {
    const posts = await Post.find().sort({reg_date: -1});

    if(posts.length == 0){
        res.status(400).json({
            success: false,
            error  : NoData.message,
            code   : NoData.code
        });
    }

    res.json({success:true, posts: posts});
});

router.post("/post", async(req, res) => {
    const {title, contents, user, password} = req.body;
    const counter = await Counter.find({});
    let post_no = counter[0].postIdCounter + 1;

    // counter랑 post등록은 transaction 안 묶여있음
    // counter는 정수인가? 그럼 overflow는?
    // 예외처리는? 예외처리 예시로 위에 post_no 증가 안시키고 하면됨 unique라 겹침
    await Counter.updateOne({id: 0}, {$set: {"postIdCounter": post_no}});
    const newPost = await Post.create({post_no, title, contents, user, password});

    // 등록 실패 예외처리

    res.json({newPost});
});

router.get("/post/:post_no", async(req, res) =>{
    const {post_no} = req.params;
    const result = await Post.find({post_no});

    // 이런것도 공통 함수로 빼서 만들면 될듯?
    // 그리고 밑에처럼 짜면 서버 꺼지는데? try로 해야하나?
    if(!result.length){
        res.status(400).json({
            success: false,
            error  : NoData.message,
            code   : NoData.code
        });
    }

    res.json({post: result});
});

router.put("/post/:post_no", async(req, res) => {
    const {post_no} = req.params;
    const {user, password, title, contents} = req.body;
    const post_info = await Post.findOne({"post_no": Number(post_no)});

    // 유저 정보에 따른 예외처리도 공통으로 처리하면 좋을듯?
    if(post_info.user != user || post_info.password != password){
        res.status(400).json({
            success: false,
            error  : InvalidUser.message,
            code   : InvalidUser.code
        });
    }

    // 수정 실패 예외처리
    await Post.updateOne({post_no}, {$set: {'title': title, 'contents': contents}});

    res.json({success: true});
});

router.delete("/post/:post_no", async(req, res) => {
    const {post_no} = req.params;
    const {user, password} = req.body;
    const post_info = await Post.findOne({"post_no": Number(post_no)});

    if(post_info.user != user || post_info.password != password){
        res.status(400).json({
            success: false,
            error  : InvalidUser.message,
            code   : InvalidUser.code
        });
    }

    // 삭제 실패 예외처리
    await Post.deleteOne({post_no});

    // 성공여부 예외처리
    res.json({success: true});
});

module.exports = router;