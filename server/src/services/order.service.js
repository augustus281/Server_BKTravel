'use strict'

const { StatusOrder } = require("../common/status")
const Order = require("../models/order.model")
const OrderItem = require("../models/order_item.model")
const OrderTour = require("../models/order_tour.model")

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

const checkOrderTour = async (order_id, tour_id) => {
    const orderTour = await OrderTour.findOne({
        where: {
            tour_id: tour_id,
            order_id: order_id
        }
    })

    return orderTour
}

const checkCompleteOrder = async (order_id, user_id) => {
    const isOrdered = await Order.findOne({
        where: {
            user_id: user_id,
            order_id: order_id,
            status: StatusOrder.COMPLETE
        }
    })

    return isOrdered
}

module.exports = {
    findOrderItem,
    findOrderById,
    checkCompleteOrder,
    checkOrderTour
}