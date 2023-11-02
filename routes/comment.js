const express = require('express');
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Counter = require("../schemas/Counter.js");
const {NoData, InvalidUser} = require("../routes/Class/CustomError.js");

router.get("/comment", async(req, res) => {
    const comments = await Comment.find().sort({reg_date: -1});
    
    if(comments.length == 0){
        res.status(400).json({
            success: false,
            error  : NoData.message,
            code   : NoData.code
        });
    }

    res.json({success:true, comments: comments});
});

router.post("/comment/", async(req, res) => {
    const {post_no, title, contents, user} = req.body;

    // 수정과 등록 공통된 부분 함수로 뺴면 좋을듯
    if(contents == ""){
        res.json({
            success: false,
            msg    : "댓글 내용을 입력해주세요."
        });
        return;
    }

    const counter = await Counter.findOne({"id": 0});
    let cmt_no = counter.CmtIdCounter + 1;

    // insert 실패시 에러처리
    await Counter.updateOne({id: 0}, {$set: {"CmtIdCounter": cmt_no}});
    const newComment = Comment.create({post_no, cmt_no, title, contents, user});

    // 이거 res에 comment에 아무것도 안담기는데?
    res.json({
        success: true,
        comment: newComment
    })
});

router.put("/comment/:cmt_no", async(req, res) => {
    const {cmt_no} = req.params;
    const {post_no, title, contents} = req.body;
    
    if(contents == ""){
        res.json({
            success: false,
            msg    : "댓글 내용을 입력해주세요."
        });
        return;
    }

    // 수정 실패 예외처리
    await Comment.updateOne({cmt_no}, {$set: {'title': title, 'contents': contents}});

    res.json({success: true})
});

// 삭제에는 조건 없음(owner, id, password)
router.delete("/comment/:cmt_no", async(req, res) => {
    const {cmt_no} = req.params;
    const {post_no} = req.body;
    
    await Comment.deleteOne({cmt_no});

    res.json({success:true});
});

module.exports = router;