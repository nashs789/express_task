const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema({
    user:{
        type: String
    },
    method:{
        type: String
    },
    params:{
        type: Array
    },
    url:{
        type: String
    },
    clientIp:{
        type: String
    },
    proxyIp:{
        type: Array
    },
    access_date:{
        type   : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Access", accessSchema);