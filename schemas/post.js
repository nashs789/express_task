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
        require: true,
        validate: {
            validator: (pw) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/.test(pw),
            message: 'Transaction Test !!!'
        }
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