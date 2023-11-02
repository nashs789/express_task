const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    post_no: {
        type   : Number,
        require: true,
        unique : true
    },
    title: {
        type   : String,
        require: true
    },
    contents:{
        type   : String,
        require: true
    },
    user: {
        type   : String,
        require: true
    },
    password:{
        type   : String,
        require: true
    },
    reg_date:{
        type   : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Posts", postSchema);