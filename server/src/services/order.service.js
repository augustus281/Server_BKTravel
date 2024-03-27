'use strict'

const OrderItem = require("../models/order_item.model")

const findOrderItem = async (cart_id, tour_id) => {
    return await OrderItem.findOne({
        where: {
            cart_id: cart_id,
            tour_id: tour_id
        }
    })
}

module.exports = {
    findOrderItem
}