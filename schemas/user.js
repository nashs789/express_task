const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user:{
        type   : String,
        require: true,
        unique : true
    },
    password:{
        type   : String,
        require: true,
        validate: {
            validator: (pw) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/.test(pw),
            message: '비밀번호는 대소문자, 숫자로 이루어진 4글자 이상이여야 합니다.'
        }
    },
    reg_date:{
        type   : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);