'use strict'

const { StatusOrder } = require("../common/status");
const Order = require("../models/order.model");

class OrderController {
    getCompleteOrderByUser = async (req, res, next) => {
        const user_id = req.params.user_id;

        const order = await Order.findAll({
            where: { user_id: user_id, status: StatusOrder.COMPLETE }
        })

        if (!order) 
            return res.status(404).json({ message: "You haven't complete order"})

        return res.status(200).json({
            message: "Get complete order successfully!",
            complete_orders: order
        })
    }

    getFailedOrderByUser = async (req, res, next) => {
        const user_id = req.params.user_id;

        const order = await Order.findAll({
            where: { user_id: user_id, status: StatusOrder.FAILED }
        })

        if (!order) 
            return res.status(404).json({ message: "You don't have failed order"})

        return res.status(200).json({
            message: "Get failed order successfully!",
            failed_orders: order
        })
    }
}   

module.exports = new OrderController()