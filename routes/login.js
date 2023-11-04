const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require("../schemas/user.js");

const {InvalidLoginInfo} = require("../routes/Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

router.post("/login", async(req, res, next) => {
    const {user, password} = req.body;
    let loginResult, token, hashedPw;
    
    try {
        hashedPw = await bcrypt.hash(password, saltRounds);
        loginResult = await User.findOne({"user": user});

        if(Common.isEmpty(loginResult)){
            throw InvalidLoginInfo;
        }

        await bcrypt.compare(password, loginResult.password)
                    .then((isMatch) => {
                        if(!isMatch){
                            throw InvalidLoginInfo;
                        }
                    });

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