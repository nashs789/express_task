const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    post_id:{
        type   : String,
        require: true,
    },
    contents:{
        type   : String,
        require: true,
    },
    user: {
        type   : String,
        require: true
    },
    nickname:{
        type   : String,
        require: true
    },
    reg_date:{
        type   : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Comment", CommentSchema);