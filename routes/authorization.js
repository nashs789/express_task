const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const {InvalidToken} = require("../routes/Class/CustomError.js");
const {Common} = require("../routes/Class/Common.js");

module.exports = {
    verify: (req, res, next) => {
        try {
            const clientToken = req.cookies.jwt;
            const decoded = jwt.verify(clientToken, SECRET_KEY);
            
            if(!decoded || Common.isEmpty(decoded.user_id)) {
                throw InvalidToken;
            }

            // locals에 저장은 되어 있지만 아직 쓰임세는 안정해짐
            res.locals.user = decoded.user_id;
            next();
        } catch (err) {
            next(err);
            return;
        }
    }
}