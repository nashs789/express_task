const express = require("express");
const router = express.Router();

const User = require("../schemas/user.js");
const { Common } = require("../routes/Class/Common.js");
const { NotValidPw } = require("../routes/Class/CustomError.js");

router.post("/join", async(req, res, next) => {
    const {nickname, password, password_check} = req.body;
    let user;

    try {
        if(Common.isEmpty(password) || password !== password_check){
            throw NotValidPw;
        }
    
        user = await User.create({nickname, password});
    } catch(err){
        next(err);
        return;
    }

    // 이렇게 success & msg 같은 공통적인건 함수로 반환해줘도 될듯?
    res.json({
        "success": true,
        "user"   : user
    });
});

module.exports = router;