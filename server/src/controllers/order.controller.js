'use strict'

const { StatusOrder } = require("../common/status");
const { NotFoundError } = require("../core/error.response");
const Order = require("../models/order.model");
const OrderItem = require("../models/order_item.model");
const OrderTour = require("../models/order_tour.model");
const VoucherOrder = require("../models/voucher_order.model")
const { findOrderById } = require("../services/order.service");
const { findTourById } = require("../services/tour.service");
const { findUserById } = require("../services/user.service");
const { findVoucherByCode } = require("../services/voucher.service");

class OrderController {

    createOrderByTourId = async (req, res, next) => {
        try {
            const { 
                user_id, tour_id, child_quantity, adult_quantity, 
                name_customer, phone_customer, address_customer
            } = req.body
    
            const user = await findUserById(user_id)
            if (!user) throw new NotFoundError("Not found user for ordering!")
            
            const tour = await findTourById(tour_id)
            if (!tour) throw new NotFoundError("Not found tour for ordering!")
            const price = parseFloat(tour.price * child_quantity * 0.75) + parseFloat(tour.price * adult_quantity)
    
            const new_order = await Order.create({
                user_id,
                total: price,
                name_customer,
                phone_customer,
                address_customer,
                total_to_pay: price
            })
    
            // create order - tour
            await OrderTour.create({
                order_id: new_order.order_id,
                tour_id: tour_id
            })
            
            // create order item
            const newOrderItem = await OrderItem.create({
                child_quantity,
                adult_quantity,
                total_price: price,
                order_id: new_order.order_id,
                tour_id,
                price: tour.price
            });
    
            // apply voucher to order
            // if (listCodeVoucher && listCodeVoucher > 0) {
            //     for (const code of listCodeVoucher) {
            //         const voucher = await findVoucherByCode(code);
            //         if (!voucher) throw new NotFoundError("Not found voucher by code!")
    
            //         totalToPay = voucher.type == 'percentage' ? parseFloat((1 - voucher.value_discount) * totalToPay)
            //             : parseFloat(totalToPay) - voucher.value_discount
    
            //         await VoucherOrder.create({
            //             order_id: new_order.order_id,
            //             voucher_id: voucher.voucher_id
            //         })
            //     }
            // }
    
            return res.status(200).json({ 
                order: new_order
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    applyVoucherToOrder = async (req, res, next) => {
        try {
            const { order_id } = req.params;
            const { listVoucherCodes } = req.body;

            const order = await findOrderById(order_id);
            if (!order) throw new NotFoundError("Not found order for applying voucher!");

            let listVouchers = [];

            let totalToPay = order.total;
            if (listVoucherCodes && listVoucherCodes.length > 0) {
                for (const code of listVoucherCodes) {
                    const voucher = await findVoucherByCode(code);
                    if (!voucher) throw new NotFoundError("Not found voucher by code!");

                    totalToPay = voucher.type == 'percentage' ? parseFloat((1 - voucher.value_discount) * totalToPay)
                                    : (parseFloat(totalToPay) - voucher.value_discount);

                    console.log("code:::", code, "-", totalToPay)

                    await VoucherOrder.create({
                        order_id,
                        voucher_id: voucher.voucher_id
                    })
                    
                    listVouchers.push(JSON.parse(JSON.stringify(voucher)));
                }
            }

            totalToPay = totalToPay <= 0 ? 0 : totalToPay;

            order.total_to_pay = totalToPay;
            await order.save();

            return res.status(200).json({ 
                message: "Apply voucher for order successfully!",
                order: order,
                listVoucher: listVouchers
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

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