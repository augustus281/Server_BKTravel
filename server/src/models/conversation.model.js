'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const GroupMember = require("./group_member.model")
const Message = require("./message.model")

class Conversation extends Model {}
Conversation.init({
    conversation_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: "conversation"})

Conversation.hasMany(GroupMember, { foreignKey: "conversation_id" })
Conversation.hasMany(Message, { foreignKey: "conversation_id" })
module.exports = Conversation