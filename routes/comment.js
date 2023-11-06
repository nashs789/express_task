const express = require('express');
const router = express.Router();

const Comment = require("../schemas/comment.js");

const {NoData, NoComments, NotPermitted} = require("./Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

const {verify} = require("../routes/authorization.js");

/**
 * @swagger
 * tags:
 *   name: COMMENTS
 *   description: 댓글 CRUD
 */

/**
 * @swagger
 *
 * comment/:post_id:
 *  get:
 *    summary: "게시글의 댓글 조회"
 *    description: "게시글의 댓글 조회 API"
 *    tags: [COMMENTS]
 *    requestBody:
 *      description: 
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
 *                        "result": [
 *                          {
 *                            "_id": "6548ef68c61a6f1c2055b826",
 *                            "post_id": "6548eb021cf0e9a91cfd2d61",
 *                            "contents": "내용은 뭐가 좋을까?",
 *                            "user": "a",
 *                            "nickname": "어벙스",
 *                            "reg_date": "2023-11-06T13:51:36.848Z",
 *                            "__v": 0
 *                          },
 *                          {
 *                            "_id": "6548ef68c61a6f1c2055b822",
 *                            "post_id": "6548eb021cf0e9a91cfd2d61",
 *                            "contents": "내용은 뭐가 좋을까?",
 *                            "user": "a",
 *                            "nickname": "어벙스",
 *                            "reg_date": "2023-11-06T13:51:36.272Z",
 *                            "__v": 0
 *                          },
 *                          {
 *                            "_id": "6548ef57c61a6f1c2055b81e",
 *                            "post_id": "6548eb021cf0e9a91cfd2d61",
 *                            "contents": "내용은 뭐가 좋을까?",
 *                            "user": "a",
 *                            "nickname": "어벙스",
 *                            "reg_date": "2023-11-06T13:51:19.330Z",
 *                            "__v": 0
 *                          }
 *                        ]
 *                      }
 */
router.get("/:post_id", async(req, res, next) => {
    try{
        const {post_id} = req.params;
        const selectResult = await Comment.find({post_id}).sort({reg_date: -1});
    
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
 * comment:
 *  post:
 *    summary: "댓글 등록"
 *    description: "댓글 등록 API"
 *    tags: [COMMENTS]
 *    requestBody: 
 *      description: 댓글 등록에 필요한 필수 파라미터 
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              post_id:
 *                type: string
 *                description: "게시글ID"
 *              contents:
 *                type: string
 *                description: "댓글 내용"
 *              user:
 *                type: string
 *                description: "유저 고유아이디"
 *              nickname:
 *                type: string
 *                description: "유저 닉네임"
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
 *                          "post_id": "6548eb021cf0e9a91cfd2d61",
 *                          "contents": "내용은 뭐가 좋을까?",
 *                          "user": "b",
 *                          "nickname": "어벙스",
 *                          "_id": "65492f79a3ad8ed4cee813e4",
 *                          "reg_date": "2023-11-06T18:24:57.987Z",
 *                          "__v": 0
 *                        }
 *                      }
 */
router.post("/", verify, async(req, res, next) => {
    try{
        const {post_id, contents, user, nickname} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        if(Common.isEmpty(contents)){
            throw NoComments;
        }

        const insertResult = await Comment.create({"post_id": post_id, contents, user, nickname});
        res.json(Common.getResultJson(insertResult));
    } catch(err){
        next(err);
    }
});

/**
 * @swagger
 *
 * comment/:cmt_no:
 *  put:
 *    summary: "댓글 수정"
 *    description: "게시댓글글 수정 API"
 *    tags: [COMMENTS]
 *    requestBody:
 *      description: 댓글 등록에 필요한 필수 parameters
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              contents:
 *                type: string
 *                description: "댓글 내용"
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
 *                          "_id": "6548ef68c61a6f1c2055b822",
 *                          "post_id": "6548eb021cf0e9a91cfd2d61",
 *                          "contents": "내용은 뭐가 좋을까?",
 *                          "user": "a",
 *                          "nickname": "어벙스",
 *                          "reg_date": "2023-11-06T13:51:36.272Z",
 *                          "__v": 0
 *                        }
 *                      }
 */
router.put("/:cmt_id", verify, async(req, res, next) => {    
    try {
        const {cmt_id} = req.params;
        const {user, contents} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }
        
        if(Common.isEmpty(contents)){
            throw NoComments;
        }

        const updateResult = await Comment.findOneAndUpdate({_id: cmt_id}, {$set: {'contents': contents}});
        res.json(Common.getResultJson(updateResult));
    } catch(err){
        next(err);
    }
});

/**
 * @swagger
 *
 * comment/:cmt_no:
 *  delete:
 *    summary: "댓글 삭제"
 *    description: "댓글 삭제 API"
 *    tags: [COMMENTS]
 *    requestBody:
 *      description: 댓글 삭제 처리한다.
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *    parameters:
 *      - in: path
 *        name: cmt_no
 *        required: true
 *        description: 댓글 ID
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
 *                          "_id": "6548ef68c61a6f1c2055b822",
 *                          "post_id": "6548eb021cf0e9a91cfd2d61",
 *                          "contents": "댓글도 수정이 되나?",
 *                          "user": "a",
 *                          "nickname": "어벙스",
 *                          "reg_date": "2023-11-06T13:51:36.272Z",
 *                          "__v": 0
 *                        }
 *                      }
 */
router.delete("/:cmt_id", verify, async(req, res, next) => {
    try{
        const {cmt_id} = req.params;
        const {user} = req.body;

        if(user != res.locals.user){
            throw NotPermitted;
        }

        const deleteResult = await Comment.findOneAndDelete({_id: cmt_id});
        res.json(Common.getResultJson(deleteResult));    // delete는 삭제 성공하면 null 반환하네
    } catch(err){
        next(err);
    }
});

module.exports = router;