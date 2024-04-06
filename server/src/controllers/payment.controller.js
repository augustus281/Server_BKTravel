'use strict'

const moment = require('moment');
const { sortObject } = require("../utils/payment")
let querystring = require('qs');
const crypto = require('crypto');
const { findTourById } = require('../services/tour.service');
const OrderItem = require('../models/order_item.model');
const User = require('../models/user.model')
const Order = require('../models/order.model');
const { StatusOrder } = require('../common/status');
const { updateTotalCart } = require('../services/cart.service');
const { findVoucherById } = require('../services/voucher.service');


const tmnCode = process.env.vnp_TmnCode;
const secretKey = process.env.vnp_HashSecret;
let url = process.env.vnp_Url;
const returnUrl = process.env.vnp_ReturnUrl; // cai nay ong de link giao dien thanh cong nha vi du: https:localhost:3000/success_payment

class PaymentController {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @body {
     *      order_items: [...]
     * }
     */
    createPaymentUrl = async (req, res, next) => {
        try {
            const { user_id, voucher_id} = req.body;
            const user = await User.findOne({ where: { user_id: user_id }})
            if (!user) return res.status(404).json({ message: "Not found user for payment!" })

            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');
            let orderId = moment(date).format('DDHHmmss');

            const new_order = await Order.create({
                payment_time: new Date(),
                status: StatusOrder.PENDING,
                total: 0,
                user_id: user_id,
                payment_id: orderId
            })

            let total_price = 0;
            for (const item of req.body.order_items) {
                const order_item = await OrderItem.findOne({ where: { id: item }});
                if (!order_item) return res.status(404).json({ message: "Not found order item!" })
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
                await tour.save()
            }
            new_order.total = total_price;
            await new_order.save()

            process.env.TZ = 'Asia/Ho_Chi_Minh';
        
            let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        
            let amount = total_price;
            let bankCode = 'NCB';

            // apply voucher to order
            const voucher = await findVoucherById(voucher_id)
            if (!voucher) return res.status(404).json({ message: "Not found voucher for using!" })
            amount = voucher.type == 'percentage' ? parseFloat((1 - voucher.value_discount) * amount)
                    : parseFloat(amount) - voucher.value_discount
            
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

            console.log(`vnpUrl:::`, vnpUrl, orderId)
            return res.status(200).json({
                link_payment: vnpUrl,
                order: new_order
            }) 
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getResultPayment = async (req, res, next) => {
        try {
            const vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];
    
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];
    
            const sortedParams = sortObject(vnp_Params);
    
            const signData = querystring.stringify(sortedParams, { encode: false });  
            
            const hmac = crypto.createHmac("sha512", process.env.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
            if(secureHash === signed){
                const orderId = vnp_Params['vnp_TxnRef'];
                const rspCode = vnp_Params['vnp_ResponseCode'];

                console.log(`orderId:::`, orderId)
                
                if (rspCode === '00') {
                    // convert status of order ---> COMPLETE
                    const order = await Order.findOne({ where: { payment_id: orderId }})
                    order.status = StatusOrder.COMPLETE;
                    await order.save()

                    console.log(`total:::`, order.total)
                    await OrderItem.destroy({ where: { order_id: order.order_id } });

                    // update total of cart
                    await updateTotalCart(order.user_id, order.total)

                    return res.status(200).json({ RspCode: '00', Message: 'You pay for order successfully!' });
                } else {
                    // convert status of order ---> FAILED
                    const order = await Order.findOne({ where: { payment_id: orderId }})
                    order.status = StatusOrder.FAILED;
                    await order.save()

                    return res.status(200).json({ RspCode: rspCode, Message: 'Transaction failed' });
                }
            } else {
                return res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    returnPayment = async (req, res, next) => {
        let vnp_Params = req.query;
        let secureHash = vnp_Params["vnp_SecureHash"];
    
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
    
        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    
        if (secureHash === signed) {
            res.send({ code: vnp_Params["vnp_ResponseCode"] });
        } else {
            res.send({ code: "97" });
        }
    }
}

module.exports = new PaymentController()