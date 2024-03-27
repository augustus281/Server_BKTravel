'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const Order = require("./order.model")
const Voucher = require("./voucher.model")

const OrderVoucher = sequelize.define('order_voucher', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'order_id'
        }
    },
    voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Voucher,
            key: 'voucher_id'
        }
    }
})

Order.belongsToMany(Voucher, { through: OrderVoucher })
Voucher.belongsToMany(Order, { through: OrderVoucher })

module.exports = OrderVoucher