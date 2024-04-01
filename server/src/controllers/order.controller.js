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
const moment = require('moment');
const { sortObject } = require("../utils/payment")
let querystring = require('qs');
const crypto = require('crypto');
const Cart = require("../models/cart.model");
const { error } = require("console");

const tmnCode = process.env.vnp_TmnCode;
const secretKey = process.env.vnp_HashSecret;
let url = process.env.vnp_Url;
const returnUrl = process.env.vnp_ReturnUrl;

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
    
            return res.status(200).json({ 
                order: new_order
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    createOrderFromCart = async (req, res, next) => {
        try {
            const { order_items, user_id, 
                name_customer, phone_customer, 
                address_customer
            } = req.body;

            const new_order = await Order.create({
                user_id,
                name_customer,
                phone_customer,
                address_customer: address_customer ? address_customer : null,
                total: 0,
                total_to_pay: 0
            })

            // find cart of user
            const cart = await Cart.findOne({ where: { user_id: user_id }})

            let total_price = 0;
            for (const item of order_items) {
                
                // chech order_item in cart ?
                const order_item = await OrderItem.findOne({ where: { id: item, cart_id: cart.cart_id }});
                if (!order_item) return res.status(404).json({ message: "Not found order item in cart!" })
                order_item.order_id = new_order.order_id;
                await order_item.save()

                let tour = await findTourById(order_item.tour_id)
                if (tour.current_customers >= tour.max_customer)
                    return res.status(400).json({ message: "Tour is full!"})

                const adultTotal = order_item.adult_quantity * parseFloat(order_item.price);
                const childTotal = 0.75 * order_item.child_quantity * parseFloat(order_item.price);
                let total_item = adultTotal + childTotal;

                if (order_item.adult_quantity + order_item.child_quantity + tour.current_customers > tour.max_customer)
                    return res.status(400).json({ message: "Slot is full!"});
                total_price += parseFloat(total_item);
                
                tour.current_customers += (order_item.adult_quantity + order_item.child_quantity);
                await tour.save();
            }
            new_order.total = total_price;
            new_order.total_to_pay = total_price;
            await new_order.save()

            return res.status(200).json({
                message: "Create order from cart successfully!",
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

            totalToPay = totalToPay <= 0 ? 5000 : totalToPay;

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

    payOrderDirectly = async (req, res, next) => {
        try {
            const { user_id, order_id } = req.body;

            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');
            let orderId = moment(date).format('DDHHmmss');

            const order = await Order.findOne({
                where: {
                    user_id: user_id,
                    order_id: order_id
                }
            })
            if (!order) throw new NotFoundError("Not found order to pay!")

            process.env.TZ = 'Asia/Ho_Chi_Minh';
        
            let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        
            // let amount = order.total;
            let amount = order.total_to_pay <= 5000 ? 10000 : order.total_to_pay; 
            let bankCode = 'NCB';
            
            let vnpUrl = url;
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ve du lich`;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            vnp_Params['vnp_BankCode'] = bankCode;
        
            vnp_Params = sortObject(vnp_Params);
        
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            vnp_Params['vnp_SecureHash'] = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            return res.status(200).json({
                link_payment: vnpUrl,
                order: order
            }) 
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getPendingOrderByUser = async (req, res, next) => {
        try {
            const user_id = req.params.user_id;
    
            const order = await Order.findAll({
                where: { user_id: user_id, status: StatusOrder.PENDING }
            })
    
            if (!order) 
                return res.status(404).json({ message: "You haven't complete order"})
    
            return res.status(200).json({
                message: "Get pending order successfully!",
                pending_orders: order
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