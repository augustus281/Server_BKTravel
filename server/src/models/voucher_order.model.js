'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/connect.mysql")
const Order = require("./order.model")
const Voucher = require("./voucher.model")

class VoucherOrder extends Model {};
VoucherOrder.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, { sequelize, modelName: "voucher_order" })

Order.belongsToMany(Voucher, { through: VoucherOrder, foreignKey: "order_id" })
Voucher.belongsToMany(Order, { through: VoucherOrder, foreignKey: "voucher_id" })

module.exports = VoucherOrder