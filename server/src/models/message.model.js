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
    message_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sent_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    from_user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to_user: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: "message" })

module.exports = Message 