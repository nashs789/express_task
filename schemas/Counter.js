const mongoose = require("mongoose");

let counterSchema = mongoose.Schema({
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
    }
});

module.exports = mongoose.model("Counter", counterSchema);