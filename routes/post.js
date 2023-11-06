const express = require('express');
const router = express.Router();

const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

const {NotFound, NoData, NotPermitted, NoRequiredData} = require("../routes/Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

const {verify} = require("../routes/authorization.js");

router.get("/", async(req, res, next) => {
    try {
        const selectResult = await Post.find({del_yn: false, hide_yn: false}).sort({reg_date: -1});

        if(selectResult.length == 0){
            throw NoData;
        }

        res.json(Common.getResultJson(selectResult));
    } catch(err){
        next(err);
    }
});

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
    }
});

router.get("/search/:keyword" , async(req, res, next) => {
    try{
        const {keyword} = req.params;
        // Date 타입의 검색은?????
        // db insert 할 때 yyyy-MM-dd 이렇게 넣어줘야 하나?
        const selectresult = await Post.find({
            $or: [
                {title: {$regex: keyword, $options: "i"}},
                { nickname: { $regex: keyword, $options: "i" } },
                { contents: { $regex: keyword, $options: "i" } }
            ]
        });

        if(!selectresult){
            throw NotFound;
        }

        res.json(Common.getResultJson(selectresult));
    } catch(err){
        next(err);
    }
});

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
    }
});

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
    }
});

router.delete("/:post_id", verify, async(req, res, next) => {
    try {
        const {post_id} = req.params;
        const {user} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const post_info = await Post.findOneAndUpdate({_id: post_id}, {$set: {del_yn: true}});
        res.json(Common.getResultJson(post_info));
    } catch(err){
        next(err);
    }
});

router.post("/hideOnOff/:post_id", verify, async(req, res, next) => {
    try{
        const {post_id} = req.params;
        const {user, hide_yn} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const post_info = await Post.findOneAndUpdate({_id: post_id}, {$set: {hide_yn: hide_yn}});
        res.json(Common.getResultJson(post_info));
    } catch(err){
        next(err);
    }
});

module.exports = router;