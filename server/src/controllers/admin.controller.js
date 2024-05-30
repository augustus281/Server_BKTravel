'use strict'

const { StatusOrder } = require("../common/index")
const Order = require("../models/order.model")
const Tour = require("../models/tour.model")

class AdminController {
    getCustomerNumber = async (req, res, next) => {
        try {
            const totalBookedNumber = await Tour.sum("booked_number")
            return res.status(200).json({
                message: "Get total booked number successfully!",
                total: totalBookedNumber
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getTotalRevenue = async (req, res, next) => {
        try {
            const totalRevenue = await Order.sum("total_to_pay", {
                where: {
                    status: StatusOrder.COMPLETE
                }
            })
            return res.status(200).json({
                message: "Get total revenue successfully!",
                total_revenue: totalRevenue
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new AdminController()