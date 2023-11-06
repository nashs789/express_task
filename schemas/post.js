const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type   : String,
        require: true
    },
    contents:{
        type   : String,
        require: true,
    },
    nickname: {
        type   : String,
        require: true
    },
    user: {
        type   : String,
        require: true
    },
    del_yn:{
        type   : Boolean,
        default: false
    },
    upt_yn:{
        type   : Boolean,
        default: false
    },
    hide_yn:{
        type   : Boolean,
        default: false
    },
    reg_date:{
        type   : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Posts", postSchema);