'use strict'

const Order = require("../models/order.model")
const OrderItem = require("../models/order_item.model")

const findOrderItem = async (cart_id, tour_id) => {
    return await OrderItem.findOne({
        where: {
            cart_id: cart_id,
            tour_id: tour_id
        }
    })
}

const findOrderById = async (order_id) => {
    return await Order.findOne({
        where: {
            order_id: order_id
        }
    })
}
module.exports = {
    findOrderItem,
    findOrderById
}