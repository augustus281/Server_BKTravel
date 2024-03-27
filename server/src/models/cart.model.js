'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const OrderItem = require("./order_item.model")

class Cart extends Model {}
Cart.init({
    cart_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount_items: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },   
    total: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
    }
}, { sequelize, modelName: "cart"})

Cart.hasMany(OrderItem, { foreignKey: "cart_id" })
module.exports = Cart