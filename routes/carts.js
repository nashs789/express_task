const express = require("express");
const router = express.Router();

const Cart = require("../schemas/carts.js");
const Goods = require("../schemas/goods.js");
const { route } = require("./goods.js");

router.get("/carts", async (req, res) => {
    const carts = await Cart.find({});
    const goodIds = carts.map((cart) => cart.goodsId);
    const goods = await Goods.find({goodsId: goodIds});

    const results = carts.map((cart) => {
        return {
            quantity: cart.quantity,
            goods   : goods.find((item) => item.goodsId === cart.goodsId)
        };
    });

    res.json({carts: results});
});

module.exports = router;