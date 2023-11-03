const express = require('express');
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Counter = require("../schemas/Counter.js");
const {NoData, NoComments, FailedUpdate, FailedDelete} = require("./Class/CustomError.js");
const { Common } = require("../routes/Class/Common.js");

router.get("/comment", async(req, res, next) => {
    let selectResult;

    try{
        selectResult = await Comment.find().sort({reg_date: -1});
    
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

router.post("/comment", async(req, res, next) => {
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

router.put("/comment/:cmt_no", async(req, res, next) => {
    const {cmt_no} = req.params;
    const {contents} = req.body;
    let updateResult;
    
    try {
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
router.delete("/comment/:cmt_no", async(req, res, next) => {
    const {cmt_no} = req.params;
    const {post_no} = req.body;
    let deleteResult;
    
    try{
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