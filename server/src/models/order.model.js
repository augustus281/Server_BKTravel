'use strict'

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/index");
const { StatusOrder } = require("../common/status");
const OrderItem = require("./order_item.model");

class Order extends Model {}

Order.init(
    {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        payment_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        payment_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(StatusOrder.CANCEL, StatusOrder.PENDING, StatusOrder.COMPLETE, StatusOrder.FAILED),
            allowNull: false,
            defaultValue: StatusOrder.PENDING
        },
        name_customer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address_customer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_customer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        total_to_pay: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        }
    }, { sequelize, modelName: 'order' }
);

Order.hasMany(OrderItem, { foreignKey: "order_id" })
module.exports = Order;
