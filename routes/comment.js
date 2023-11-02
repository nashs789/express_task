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

module.exports = router;