const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user:{
        type   : String,
        require: true,
        unique : true
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

module.exports = mongoose.model("User", userSchema);