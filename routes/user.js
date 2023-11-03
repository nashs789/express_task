const express = require("express");
const router = express.Router();

const User = require("../schemas/user.js");

router.post("/join", async(req, res, next) => {
    const {nickname, password, password_check} = req.body;

    // undefine 확인하는 공통 함수도 필요할듯
    if(password !== password_check){
        // 예외처리 필요
        res.json({
            "success": false,
            "msg"    : "비밀번호 불일치"
        });
        return
    }
    
    // try - catch는 이게 최선일까?
    try {
        const user = await User.create({nickname, password});
    } catch(err){
        next(err);
    }

    // 이렇게 success & msg 같은 공통적인건 함수로 반환해줘도 될듯?
    res.json({"success": true});
});

module.exports = router;