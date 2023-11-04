const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const {InvalidLoginInfo} = require("../routes/Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");
const User = require("../schemas/user.js");

router.post("/login", async(req, res, next) => {
    const {user, password} = req.body;
    let loginResult;
    let token;
    
    try {
        loginResult = await User.findOne({user, password});

        if(Common.isEmpty(loginResult)){
            throw InvalidLoginInfo;
        }

        token = jwt.sign({user_id: user},
                         SECRET_KEY,
                         {expiresIn: '1h'});
        res.cookie('jwt', token);
    } catch(err){
        next(err);
        return;
    }

    res.json({
        "sucess": true,
        "result": loginResult,
        "token" : token
    })
});

module.exports = router;