const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user:{
        type   : String,
        require: true,
        unique : true
    },
    nickname:{
        type   : String,
        require: true
    },
    password:{
        type   : String,
        require: true
    },
    del_yn:{
        type   : Boolean,
        default: false
    },
    reg_date:{
        type   : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);