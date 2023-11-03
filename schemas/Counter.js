const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    id: {
        type   : Number,
        default: 0
    },
    postIdCounter:{
        type   : Number,
        default: 0
    },
    CmtIdCounter:{
        type   : Number,
        default: 0
    },
    UserIdCounter:{
        type   : Number,
        default: 0
    }
});

module.exports = mongoose.model("Counter", counterSchema);