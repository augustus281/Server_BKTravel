'use strict'

const Voucher = require("../models/voucher.model")

const decreaseCountOfVoucher = async (code) => {
    const voucher = await Voucher.findOne({ where: { code: code }})
    if (!voucher) return null;
    voucher.count--;
    await voucher.save();
    return voucher;
}

const findVoucherById = async (id) => {
    return await Voucher.findOne({ where: { voucher_id: id }})
}

const findVoucherByCode = async (code) => {
    return await Voucher.findOne({ where: { code_voucher: code }})
}

module.exports = {
    decreaseCountOfVoucher,
    findVoucherById,
    findVoucherByCode
}