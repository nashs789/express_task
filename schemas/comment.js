const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    post_no:{
        type   : Number,
        require: true,
    },
    cmt_no:{
        type   : Number,
        require: true,
        unique : true
    },
    contents:{
        type   : String,
        require: true,
    },
    user: {
        type   : String,
        require: true
    },
    reg_date:{
        type   : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Comment", CommentSchema);