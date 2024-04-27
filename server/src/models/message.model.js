'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")

class Message extends Model {}
Message.init({
    message_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, { sequelize, modelName: "message" })

module.exports = Message 