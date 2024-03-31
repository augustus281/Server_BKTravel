'use strict'

const Voucher = require("../models/voucher.model")

const updateNumberVoucher = async (id, count) => {
    const voucher = await Voucher.findOne({ where: { voucher_id: id }})
    // updating.....
}

const findVoucherById = async (id) => {
    return await Voucher.findOne({ where: { voucher_id: id }})
}

const findVoucherByCode = async (code) => {
    return await Voucher.findOne({ where: { code_voucher: code }})
}

module.exports = {
    updateNumberVoucher,
    findVoucherById,
    findVoucherByCode
}