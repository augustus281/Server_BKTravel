'use strict'

const { NotFoundError } = require("../core/error.response")
const Order = require("../models/order.model")
const Voucher = require("../models/voucher.model")
const cloudinary = require("../utils/cloudinary")
const Sequelize = require("sequelize")
const Op = Sequelize.Op

class VoucherController {

    createVoucher = async (req, res, next) => {
        try {
            const { code_voucher, type, value_discount, max_number,
                min_order_value, start_date, expired_date, description
            } = req.fields
    
            const result = req.files.image.path
            const link_image = await cloudinary.uploader.upload(result)

            const new_voucher = await Voucher.create({
                code_voucher: code_voucher,
                type: type,
                value_discount: value_discount,
                max_number: max_number,
                min_order_value: min_order_value,
                start_date: start_date,
                expired_date: expired_date,
                description: description,
                remain_number: max_number,
                is_active: true,
                image: link_image.secure_url
            })

            return res.status(200).json({
                message: "Create voucher successfully!",
                data: new_voucher
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getVoucher = async (req, res, next) => {
        try {
            const voucher_id = req.params.voucher_id;
            const voucher = await Voucher.findOne({
                where: { voucher_id },
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                }
            })
            if (!voucher) return res.status(404).json({ Message: "Not found voucher!" })

            return res.status(200).json({ 
                data: voucher
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getVoucherByOrderId = async (req, res, next) => {
        try {
            const order_id = req.params;
            const order = await Order.findByPk(order_id, { include: Voucher })
            if (!order) throw new NotFoundError("Not found order!")

            return res.status(200).json({
                message: "Get vouchers of order successfully!",
                vouchers: order.Voucher
            })

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    getAllVouchers = async (req, res, next) => {
        try {
            const all_vouchers = await Voucher.findAll({
                where: { is_active: true },
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                }
            })

            return res.status(200).json({
                data: all_vouchers
            })
        } catch (error) {
            return res.status(404).json({ Message: error })
        }
    }

    updateVoucher = async (req, res, next) => {
        const voucher_id = req.params.voucher_id;
        const updated_voucher = req.body;

        const voucher = await Voucher.findOne({ where: { voucher_id }})
        if (!voucher) return res.status(404).json({ message: "Not found voucher"})

        const result = await Voucher.update(updated_voucher, {
            where: { voucher_id }
        })
        if (!result) 
            return res.status(400).json({ Message: "Update fail!"})
        return res.status(200).json({ message: "Update voucher successfully!"})
    }

    deleteVoucher = async (req, res, next) => {
        try {
            const voucher_id = req.params.voucher_id
            const voucher = await Voucher.findOne({ where : { voucher_id }})
            if (!voucher) return res.status(404).json({ Message: "Not found voucher!"})

            await voucher.destroy()
            return res.status(200).json({ Message: "Delete voucher successfully"})
        } catch (error) {
            return res.status(400).json({ Message: error})
        }
    }

    deleteAllInactiveVoucher = async (req, res, next) => {
        try {   
            const deletedCount = await Voucher.destroy({
                where: {
                    is_active: false
                }
            })

            return res.status(200).json({ 
                message: `Deleted ${deletedCount} inactive vouchers successfully.`
            })
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error: error.message })
        }
    }

    updateExpiredVoucher = async (req, res, next) => {
        try {
            const expired_voucher = await Voucher.findAll({
                where: {
                    [Op.or] :   [
                        { expired_date: { [Op.lt]: new Date() }},
                        { remain_number: { [Op.eq]: 0 }}
                    ]
                }
            })

            await Voucher.update(
                { is_active: false }, {
                    where: {
                        voucher_id: expired_voucher.map(voucher => voucher.voucher_id)
                    }
                }
            )

            return res.status(200).json({
                message: `Updated ${expired_voucher.length} expired vouchers successfully!`
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = new VoucherController()