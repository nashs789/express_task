const express = require('express');
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Counter = require("../schemas/Counter.js");

const {NoData, NoComments, InvalidUser, FailedUpdate, FailedDelete} = require("./Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

const {verify} = require("../routes/authorization.js");

router.get("/comment/:post_no", async(req, res, next) => {
    const {post_no} = req.params;
    let selectResult;

    try{
        selectResult = await Comment.find({post_no}).sort({reg_date: -1});
    
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

router.post("/comment", verify, async(req, res, next) => {
    const {post_no, contents, user} = req.body;
    let insertResult;

    try{
        if(Common.isEmpty(contents)){
            throw NoComments;
        }

        const counter = await Counter.findOne({"id": 0});
        let cmt_no = counter.CmtIdCounter + 1;

        await Counter.updateOne({id: 0}, {$set: {"CmtIdCounter": cmt_no}});
        insertResult = await Comment.create({post_no, cmt_no, contents, user});
        
        if(!insertResult){
            throw FailedUpdate;
        }
    } catch(err){
        next(err);
        return;
    }

    res.json({
        "success": true,
        "result" : insertResult
    })
});

router.put("/comment/:cmt_no", verify, async(req, res, next) => {
    const {cmt_no} = req.params;
    const {user, contents} = req.body;
    let updateResult;
    
    try {
        const cmtInfo = await Comment.findOne({cmt_no});

        if(cmtInfo != user){
            throw InvalidUser;
        }
        
        if(Common.isEmpty(contents)){
            throw NoComments;
        }
        
        updateResult = await Comment.updateOne({cmt_no}, {$set: {'contents': contents}});
        
        if(!updateResult){
            throw FailedUpdate;
        }
    } catch(err){
        next(err);
        return;
    }

    res.json({
        "success": true,
        "result" : updateResult
    })
});

// 삭제에는 조건 없음(owner, id, password)
router.delete("/comment/:cmt_no", verify, async(req, res, next) => {
    const {cmt_no} = req.params;
    const {user} = req.body;
    let deleteResult;
    
    try{
        const cmtInfo = await Comment.findOne({cmt_no});

        if(cmtInfo != user){
            throw InvalidUser;
        }

        deleteResult = await Comment.deleteOne({cmt_no});

        if(deleteResult.deletedCount == 0){
            throw FailedDelete;
        }
    } catch(err){
        next(err);
        return;
    }

    res.json({
        "success":true,
        "result" :deleteResult
    });
});

module.exports = router;