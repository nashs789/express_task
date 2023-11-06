const express = require('express');
const router = express.Router();

const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

const {NotFound, NoData, NotPermitted, NoRequiredData} = require("../routes/Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

const {verify} = require("../routes/authorization.js");

// test { o }
router.get("/", async(req, res, next) => {
    try {
        const selectResult = await Post.find({del_yn: false, hide_yn: false}).sort({reg_date: -1});

        if(selectResult.length == 0){
            throw NoData;
        }

        res.json(Common.getResultJson(selectResult));
    } catch(err){
        next(err);
        return;
    }
});

// test { o }
router.get("/:post_id", async(req, res, next) =>{
    try{
        const {post_id} = req.params;
        const selectresult = await Post.findOne({_id: post_id});

        if(!selectresult){
            throw NotFound;
        }

        res.json(Common.getResultJson(selectresult));
    } catch(err){
        next(err);
        return;
    }
});

// test { o }
router.post("/", verify, async(req, res, next) => {
    try {
        const {title, contents, user} = req.body;

        if(Common.isEmpty(title) || Common.isEmpty(contents)){
            throw NoRequiredData;
        }

        const insertResult = await Post.create({title, contents, user});
        res.json(Common.getResultJson(insertResult));
    } catch(err){
        next(err);
        return;
    }
});

// test { o }
router.put("/:post_id", verify, async(req, res, next) => {
    try{
        const {post_id} = req.params;
        const {user, title, contents} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const updateResult = await Post.findOneAndUpdate({_id: post_id}, {$set: {title: title, contents: contents, upt_yn: true}});
        res.json(Common.getResultJson(updateResult));
    } catch(err) {
        next(err);
        return;
    }
});

// test { o } 댓글 삭제도 해야함
router.delete("/:post_id", verify, async(req, res, next) => {
    try {
        const {post_id} = req.params;
        const {user} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const post_info = await Post.findOneAndDelete({_id: post_id});
        await Comment.deleteMany({_id: post_id});
        res.json(Common.getResultJson(post_info));
    } catch(err){
        next(err);
        return;
    }
});

module.exports = router;