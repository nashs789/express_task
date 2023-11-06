const express = require('express');
const router = express.Router();

const Comment = require("../schemas/comment.js");

const {NoData, NoComments, NotPermitted} = require("./Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

const {verify} = require("../routes/authorization.js");

router.get("/:post_id", async(req, res, next) => {
    try{
        const {post_id} = req.params;
        const selectResult = await Comment.find({post_id}).sort({reg_date: -1});
    
        if(selectResult.length == 0){
            throw NoData;
        }

        res.json(Common.getResultJson(selectResult));
    } catch(err){
        next(err);
    }
});

router.post("/", verify, async(req, res, next) => {
    try{
        const {post_id, contents, user, nickname} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        if(Common.isEmpty(contents)){
            throw NoComments;
        }

        const insertResult = await Comment.create({"post_id": post_id, contents, user, nickname});
        res.json(Common.getResultJson(insertResult));
    } catch(err){
        next(err);
    }
});

router.put("/:cmt_id", verify, async(req, res, next) => {    
    try {
        const {cmt_id} = req.params;
        const {user, contents} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }
        
        if(Common.isEmpty(contents)){
            throw NoComments;
        }

        const updateResult = await Comment.findOneAndUpdate({_id: cmt_id}, {$set: {'contents': contents}});
        res.json(Common.getResultJson(updateResult));
    } catch(err){
        next(err);
    }
});

router.delete("/:cmt_id", verify, async(req, res, next) => {
    try{
        const {cmt_id} = req.params;
        const {user} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const deleteResult = await Comment.findOneAndDelete({_id: cmt_id});
        res.json(Common.getResultJson(deleteResult));    // delete는 삭제 성공하면 null 반환하네
    } catch(err){
        next(err);
    }
});

module.exports = router;