'use strict'

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect.mysql');
const Order = require('./order.model');
const Tour = require('./tour.model');

class OrderTour extends Model {}
OrderTour.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
}, { sequelize, modelName: "order_tour" })

Order.belongsToMany(Tour, { through: OrderTour, foreignKey: "order_id" })
Tour.belongsToMany(Order, { through: OrderTour, foreignKey: "tour_id" })

module.exports = OrderTour


