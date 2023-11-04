const express = require("express");
const router = express.Router();

const User = require("../schemas/user.js");
const {Common} = require("../routes/Class/Common.js");
const {InvalidPw} = require("../routes/Class/CustomError.js");

router.post("/join", async(req, res, next) => {
    const {user, password, password_check} = req.body;
    let insertResult;

    try {
        if(Common.isEmpty(password) || password !== password_check){
            throw InvalidPw;
        }
    
        insertResult = await User.create({user, password});
    } catch(err){
        next(err);
        return;
    }

    // 이렇게 success & msg 같은 공통적인건 함수로 반환해줘도 될듯?
    res.json({
        "success": true,
        "result" : insertResult
    });
});

module.exports = router;