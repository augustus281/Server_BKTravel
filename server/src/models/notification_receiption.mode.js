'use strict'

const { DataTypes, Model } = require("sequelize")
const User = require("./user.model")
const Notification = require("./notification.model")

class NotiReceipt extends Model {}
NotiReceipt.init({
    id: {
        type: DataTypes,
        autoIncrement: true,
        primaryKey: true
    }
}, { sequelize, modelName: "notification_receiption" })

User.belongsToMany(Notification, { through: NotiReceipt, foreignKey: "user_id" })
Notification.belongsToMany(User, { through: NotiReceipt, foreignKey: "noti_id" })

module.exports = NotiReceipt