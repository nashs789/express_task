const express = require('express');
const router = express.Router();

const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

const {NotFound, NoData, NotPermitted, NoRequiredData} = require("../routes/Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

const {verify} = require("../routes/authorization.js");

/**
 * @swagger
 * tags:
 *   name: POSTS
 *   description: 게시글 CRUD
 */

/**
 * @swagger
 *
 * post:
 *  get:
 *    summary: "전체 게시글 조회"
 *    description: "전체 게시글 조회하는 API"
 *    tags: [POSTS]
 *    requestBody:
 *      description: 삭제, 숨김 처리된 게시글을 제외한 모든 게시글을 DB에서 가져온다
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
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
 *                      [
 *                          {
 *                            "_id": "6548fde7bfb3e314c4170bff",
 *                            "title": "Title2",
 *                            "contents": "토큰 테스트를 해볼까?",
 *                            "user": "a",
 *                            "del_yn": false,
 *                            "upt_yn": false,
 *                            "hide_yn": false,
 *                            "reg_date": "2023-11-06T14:53:27.210Z",
 *                            "__v": 0
 *                          },
 *                          {
 *                            "_id": "6548eb041cf0e9a91cfd2d6d",
 *                            "title": "Title2",
 *                            "contents": "토큰 테스트를 해볼까?",
 *                            "user": "a",
 *                            "del_yn": false,
 *                            "upt_yn": false,
 *                            "hide_yn": false,
 *                            "reg_date": "2023-11-06T13:32:52.220Z",
 *                            "__v": 0
 *                          }
 *                      ]
 */
router.get("/", async(req, res, next) => {
    try {
        const selectResult = await Post.find({del_yn: false, hide_yn: false}).sort({reg_date: -1});

        if(selectResult.length == 0){
            throw NoData;
        }

        res.json(Common.getResultJson(selectResult));
    } catch(err){
        next(err);
    }
});

/**
 * @swagger
 *
 * post/:post_id:
 *  get:
 *    summary: "특정 게시글 조회"
 *    description: "특정 게시글 조회하는 API"
 *    tags: [POSTS]
 *    requestBody:
 *      description: 게시글 ID를 가지고 게시글 상세보기
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *    parameters:
 *      - in: path
 *        name: post_id
 *        required: true
 *        description: 게시글 ID
 *        schema:
 *          type: string
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
 *                        "_id": "6548fde7bfb3e314c4170bff",
 *                        "title": "Title2",
 *                        "contents": "토큰 테스트를 해볼까?",
 *                        "user": "a",
 *                        "del_yn": false,
 *                        "upt_yn": false,
 *                        "hide_yn": false,
 *                        "reg_date": "2023-11-06T14:53:27.210Z",
 *                        "__v": 0
 *                      }
 */
router.get("/:post_id", async(req, res, next) =>{
    try{
        const {post_id} = req.params;
        const selectresult = await Post.findOne({_id: post_id});

        if(!selectresult){
            throw NotFound;
        }

        res.json(Common.getResultJson(selectresult));
    } catch(err){
        next(err);
    }
});

/**
 * @swagger
 *
 * search/:keyword:
 *  get:
 *    summary: "게시글중에서 키워드를 가지고 조회"
 *    description: "키워드를 포함한 게시글 조회 API"
 *    tags: [POSTS]
 *    requestBody:
 *      description: 
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *    parameters:
 *      - in: path
 *        name: keyword
 *        required: true
 *        description: 검색어
 *        schema:
 *          type: string
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
 *                        "result": [
 *                          {
 *                            "_id": "6548eb021cf0e9a91cfd2d59",
 *                            "title": "수정 test",
 *                            "contents": "수정하는 중입니다.",
 *                            "user": "a",
 *                            "del_yn": false,
 *                            "upt_yn": true,
 *                            "hide_yn": false,
 *                            "reg_date": "2023-11-06T13:32:50.623Z",
 *                            "__v": 0
 *                          },
 *                          {
 *                            "_id": "6548eb021cf0e9a91cfd2d61",
 *                            "title": "수정 test",
 *                            "contents": "수정하는 중입니다.",
 *                            "user": "a",
 *                            "del_yn": true,
 *                            "upt_yn": true,
 *                            "hide_yn": true,
 *                            "reg_date": "2023-11-06T13:32:50.952Z",
 *                            "__v": 0
 *                          }
 *                        ]
 *                      }
 */
router.get("/search/:keyword" , async(req, res, next) => {
    try{
        const {keyword} = req.params;
        // Date 타입의 검색은?????
        // db insert 할 때 yyyy-MM-dd 이렇게 넣어줘야 하나?
        const selectresult = await Post.find({
            $or: [
                {title: {$regex: keyword, $options: "i"}},
                { nickname: { $regex: keyword, $options: "i" } },
                { contents: { $regex: keyword, $options: "i" } }
            ]
        });

        if(!selectresult){
            throw NotFound;
        }

        res.json(Common.getResultJson(selectresult));
    } catch(err){
        next(err);
    }
});

/**
 * @swagger
 *
 * post:
 *  post:
 *    summary: "게시글 등록"
 *    description: "게시글 등록 API"
 *    tags: [POSTS]
 *    requestBody:
 *      description: 게시글 등록에 필요한 필수 parameters
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: "게시글 제목"
 *              contents:
 *                type: string
 *                description: "게시글 내용"
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
 *                          "title": "Title2",
 *                          "contents": "토큰 테스트를 해볼까?",
 *                          "user": "a",
 *                          "del_yn": false,
 *                          "upt_yn": false,
 *                          "hide_yn": false,
 *                          "_id": "65492c421db7369dea4a5af6",
 *                          "reg_date": "2023-11-06T18:11:14.710Z",
 *                          "__v": 0
 *                        }
 *                      }
 */
router.post("/", verify, async(req, res, next) => {
    try {
        const {title, contents, user} = req.body;

        if(Common.isEmpty(title) || Common.isEmpty(contents)){
            throw NoRequiredData;
        }

        const insertResult = await Post.create({title, contents, user});
        res.json(Common.getResultJson(insertResult));
    } catch(err){
        next(err);
    }
});

/**
 * @swagger
 *
 * post/:post_id:
 *  put:
 *    summary: "게시글 수정"
 *    description: "게시글 수정 API"
 *    tags: [POSTS]
 *    requestBody:
 *      description: 게시글 등록에 필요한 필수 parameters
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: "게시글 제목"
 *              contents:
 *                type: string
 *                description: "게시글 내용"
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
 *                          "title": "Title2",
 *                          "contents": "토큰 테스트를 해볼까?",
 *                          "user": "a",
 *                          "del_yn": false,
 *                          "upt_yn": false,
 *                          "hide_yn": false,
 *                          "_id": "65492c421db7369dea4a5af6",
 *                          "reg_date": "2023-11-06T18:11:14.710Z",
 *                          "__v": 0
 *                        }
 *                      }
 */
router.put("/:post_id", verify, async(req, res, next) => {
    try{
        const {post_id} = req.params;
        const {user, title, contents} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const updateResult = await Post.findOneAndUpdate({_id: post_id}, {$set: {title: title, contents: contents, upt_yn: true}});
        res.json(Common.getResultJson(updateResult));
    } catch(err) {
        next(err);
    }
});

/**
 * @swagger
 *
 * post/:post_id:
 *  delete:
 *    summary: "게시글 삭제"
 *    description: "게시글 삭제 API"
 *    tags: [POSTS]
 *    requestBody:
 *      description: del_yn을 true 처리해서 게시글을 삭제 처리한다.
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *    parameters:
 *      - in: path
 *        name: post_id
 *        required: true
 *        description: 게시글 ID
 *        schema:
 *          type: string
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
 *                          "title": "Title2",
 *                          "contents": "토큰 테스트를 해볼까?",
 *                          "user": "a",
 *                          "del_yn": true,
 *                          "upt_yn": false,
 *                          "hide_yn": false,
 *                          "_id": "65492c421db7369dea4a5af6",
 *                          "reg_date": "2023-11-06T18:11:14.710Z",
 *                          "__v": 0
 *                        }
 *                      }
 */
router.delete("/:post_id", verify, async(req, res, next) => {
    try {
        const {post_id} = req.params;
        const {user} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const post_info = await Post.findOneAndUpdate({_id: post_id}, {$set: {del_yn: true}});
        res.json(Common.getResultJson(post_info));
    } catch(err){
        next(err);
    }
});

/**
 * @swagger
 *
 * hideOnOff/:post_id:
 *  post:
 *    summary: "게시글 숨김 처리"
 *    description: "게시글 숨김 API"
 *    tags: [POSTS]
 *    requestBody:
 *      description: hide_yn을 true 처리해서 게시글을 삭제 처리한다.
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *    parameters:
 *      - in: path
 *        name: post_id
 *        required: true
 *        description: 게시글 ID
 *        schema:
 *          type: string
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
 *                          "title": "Title2",
 *                          "contents": "토큰 테스트를 해볼까?",
 *                          "user": "a",
 *                          "del_yn": false,
 *                          "upt_yn": false,
 *                          "hide_yn": true,
 *                          "_id": "65492c421db7369dea4a5af6",
 *                          "reg_date": "2023-11-06T18:11:14.710Z",
 *                          "__v": 0
 *                        }
 *                      }
 */
router.post("/hideOnOff/:post_id", verify, async(req, res, next) => {
    try{
        const {post_id} = req.params;
        const {user, hide_yn} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const post_info = await Post.findOneAndUpdate({_id: post_id}, {$set: {hide_yn: hide_yn}});
        res.json(Common.getResultJson(post_info));
    } catch(err){
        next(err);
    }
});

module.exports = router;