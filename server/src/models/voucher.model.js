'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const { TypeDiscount } = require("../common/status")

const Voucher = sequelize.define("voucher", {
    voucher_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    code_voucher: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM(TypeDiscount.PERCENTAGE, TypeDiscount.FIXED),
        allowNull: false
    },
    value_discount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    max_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    remain_number: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    min_order_value: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expired_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Voucher