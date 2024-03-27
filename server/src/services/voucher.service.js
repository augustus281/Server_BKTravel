'use strict'

const Voucher = require("../models/voucher.model")

const updateNumberVoucher = async (id, count) => {
    const voucher = await Voucher.findOne({ where: { voucher_id: id }})
    // updating.....
}

const findVoucherById = async (id) => {
    return await Voucher.findOne({ where: { voucher_id: id }})
}

module.exports = {
    updateNumberVoucher,
    findVoucherById
}