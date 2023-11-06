const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require("../schemas/user.js");

const {Common} = require("../routes/Class/Common.js");
const {InvalidPw, InvalidJoinInfo} = require("../routes/Class/CustomError.js");

router.post("/join", async(req, res, next) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
    const {user, nickname, password, password_check} = req.body;
    let insertResult;

    try {
        if(Common.isEmpty(password) || password !== password_check){
            throw InvalidPw;
        }

        if(!regex.test(password)){
            throw InvalidJoinInfo;
        }

        const hashedPw = await bcrypt.hash(password, saltRounds);
        insertResult = await User.create({user: user, nickname: nickname, password: hashedPw});

        res.json(Common.getResultJson(insertResult))
    } catch(err){
        next(err);
    }
});

router.post("/delete", async(req, res, next) => {
    const {user} = req.body;

    try {
        await User.updateOne({user}, {$set: {"del_yn": true}});

        res.redirect('/api/logout');
    } catch(err){
        next(err);
    }
});

module.exports = router;