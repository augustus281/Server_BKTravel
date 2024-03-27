'use strict'

const Cart = require("../models/cart.model")

const updateTotalCart = async (user_id, total_price) => {
    const cart = await Cart.findOne({
        where: { user_id: user_id }
    });
    cart.total = cart.total - parseFloat(total_price);
    await cart.save();
}

const updateTotalPriceOrderItem = async (item_id, ) => {

}
module.exports = {
    updateTotalCart
}