const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require("../schemas/user.js");

const {Common} = require("../routes/Class/Common.js");
const {InvalidPw, InvalidJoinInfo} = require("../routes/Class/CustomError.js");

/**
 * @swagger
 * tags:
 *   name: USERS
 *   description: 회원 가입 & 탈퇴
 */

/**
 * @swagger
 *
 * user/join:
 *  post:
 *    summary: "유저 등록"
 *    description: "유저를 등록하는 API"
 *    tags: [USERS]
 *    requestBody:
 *      description: DB에 넣고자 하는 데이터 클라이언트에서 넘겨준다.
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: string
 *                description: "유저 고유아이디"
 *              nickname:
 *                type: string
 *                description: "닉네임"
 *              password:
 *                type: string
 *                description: "비밀번호 확인"
 *              password_check:
 *                type: string
 *                description: "비밀번호 재확인"
 *    responses:
 *      "200":
 *        description: 매번 같은 데이터가 보장되지는 않음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                result:
 *                  type: json
 *                  example:
 *                      {
 *                        "success": true,
 *                        "result": {
 *                          "user": "c",
 *                          "nickname": "ccc",
 *                          "password": "$2b$10$KNSpqmKBjJYfvhnhAir0P.qR3qqjpSMfLsjB2GiFjYJ9WhRdj/dD.",
 *                          "del_yn": false,
 *                          "_id": "654925edbbf372698d8f3489",
 *                          "last_date": "2023-11-06T17:44:13.694Z",
 *                          "reg_date": "2023-11-06T17:44:13.694Z",
 *                          "__v": 0
 *                        }
 *                      }
 */
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

        res.json(Common.getResultJson(insertResult));
    } catch(err){
        next(err);
    }
});

/**
 * @swagger
 *
 * user/delete:
 *  post:
 *    summary: "유저 삭제"
 *    description: "유저를 삭제하는 API"
 *    tags: [USERS]
 *    requestBody:
 *      description: 유저에 데이터에서 del_yn을 true로 만든다.
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: string
 *                description: "유저 고유아이디"
 *    responses:
 *      "200":
 *        description: 매번 같은 데이터가 보장되지는 않음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                result:
 *                  type: json
 *                  example:
 *                      {
 *                        "success": true,
 *                        "result": {
 *                          "acknowledged": true,
 *                          "modifiedCount": 0,
 *                          "upsertedId": null,
 *                          "upsertedCount": 0,
 *                          "matchedCount": 1
 *                        }
 *                      }
 */
router.post("/delete", async(req, res, next) => {
    try {
        const {user} = req.body;
        const result = await User.updateOne({user}, {$set: {"del_yn": true}});

        // res.redirect('log/logout');
        res.json(Common.getResultJson(result));
    } catch(err){
        next(err);
    }
});

module.exports = router;