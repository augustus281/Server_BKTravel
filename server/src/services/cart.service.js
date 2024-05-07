'use strict'

const Cart = require("../models/cart.model")

const updateTotalCart = async (user_id, total_price) => {
    const cart = await Cart.findOne({
        where: { user_id: user_id }
    });
    cart.total = cart.total - parseFloat(total_price);
    if (cart.total <= 0) cart.total = 0;
    await cart.save();
}

module.exports = {
    updateTotalCart
}