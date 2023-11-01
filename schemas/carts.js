const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    goodsId: {
        type    : Number,
        required: true
    },
    quality: {
        type    : Number,
        required: true
    }
});

module.exports = mongoose.model("Cart", cartSchema);