const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nickname:{
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

// const schema = new mongoose.Schema({
//     phoneNumber: {
//         type: String,
//         validate: {
//             validator: (value) => /^(?=.*[a-zA-Z])(?=.*\d).{3,}$/.test(value),
//             message: '알파벳 대소문자와 숫자가 모두 포함되어야 하며, 3글자 이상이어야 합니다.'
//         }
//     }
// });

// const schema = new mongoose.Schema({
//     phoneNumber: {
//         type: String,
//         validate: {
//             validator: (value) => value.length === 4,
//             message: '4글자여야 합니다.'
//         }
//     }
// });

module.exports = mongoose.model("User", userSchema);