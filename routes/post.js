const express = require('express');
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");
const Counter = require("../schemas/Counter.js")
const {NoData, NoPost, InvalidUser, NoRequiredData} = require("../routes/Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

const {verify} = require("../routes/authorization.js");

router.get("/post", async(req, res, next) => {
    let selectResult;

    try {
        selectResult = await Post.find().sort({reg_date: -1});

        if(selectResult.length == 0){
            throw NoData;
        }
    } catch(err){
        next(err);
        return;
    }

    res.json({
        "success": true, 
        "result" : selectResult
    });
});

router.post("/post", verify, async(req, res, next) => {
    const {title, contents, user} = req.body;
    let insertResult;

    try {
        if(Common.isEmpty(title) || Common.isEmpty(contents)){
            throw NoRequiredData;
        }

        const counter = await Counter.find({});
        let post_no = counter[0].postIdCounter + 1;

        // counter랑 post등록은 transaction 안 묶여있음 => 테스트 결과 밑에서 터지면 위만 반영됨
        // counter는 정수인가? 그럼 overflow는?
        await Counter.updateOne({id: 0}, {$set: {"postIdCounter": post_no}});
        insertResult = await Post.create({post_no, title, contents, user});
    } catch(err){
        next(err);
        return;
    }

    res.json({
        "success": true,
        "result" : insertResult
    });
});

router.get("/post/:post_no", async(req, res, next) =>{
    const {post_no} = req.params;
    let selectresult;
    
    try{
        selectresult = await Post.find({post_no});

        if(!selectresult.length){
            throw NoData;
        }
    } catch(err){
        next(err);
        return;
    }

    res.json({
        "success": true,
        "result" : selectresult
    });
});

router.put("/post/:post_no", verify, async(req, res, next) => {
    const {post_no} = req.params;
    const {user, title, contents} = req.body;

    try{
        const post_info = await Post.findOne({"post_no": Number(post_no)});
        
        if(Common.isEmpty(post_info)){
            throw NoPost;
        }

        if(post_info.user != user){
            throw InvalidUser;
        }

        await Post.updateOne({post_no}, {$set: {'title': title, 'contents': contents}});

    } catch(err) {
        next(err);
        return;
    }

    res.json({"success": true});
});

router.delete("/post/:post_no", verify, async(req, res, next) => {
    const {post_no} = req.params;
    const {user} = req.body;

    try {
        const post_info = await Post.findOne({"post_no": Number(post_no)});

        if(Common.isEmpty(post_info)){
            throw NoPost;
        }

        if(post_info.user != user){
            throw InvalidUser;
        }

        await Post.deleteOne({post_no});
        await Comment.deleteMany({post_no});
    } catch(err){
        next(err);
        return;
    }

    res.json({"success": true});
});

module.exports = router;