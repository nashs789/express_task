const mongoose = require("mongoose");

const ErrorSchema = new mongoose.Schema({
    clientIp:{
        type: String
    },
    proxyIp:{
        type: Array
    },
    name:{
        type: String
    },
    msg:{
        type: String
    },
    stack:{
        type: String
    },
    reg_date:{
        type   : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Error", ErrorSchema);