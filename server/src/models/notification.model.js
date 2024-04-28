'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/connect.mysql")

class Notification extends Model {}
Notification.init({
    noti_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { sequelize, modelName: "notification" })

module.exports = Notification