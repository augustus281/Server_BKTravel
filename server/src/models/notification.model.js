// 'use strict'

// const { DataTypes, Model } = require("sequelize")
// const sequelize = require("../database/index")
// const { TypeNotification } = require("../common/status")
// const User = require("./user.model")

// class Notification extends Model {}
// Notification.init({
//     noti_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     noti_type: {
//         type: DataTypes.ENUM(TypeNotification.ORDER_001, TypeNotification.ORDER_002, 
//             TypeNotification.PROMOTION_001, TypeNotification.TOUT_001),
//         allowNull: false
//     },
//     content: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     options: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     receiver_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     sender_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// }, { sequelize, modelName: "notification" })

// Notification.belongsTo(User, { foreignKey: "re"})

// module.exports = Notification