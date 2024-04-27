'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const Message = require("./message.model")

class Group extends Model {}
Group.init({
    group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    description : {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { sequelize, modelName: "group" })

Group.hasMany(Message, { foreignKey: "group_id" })
module.exports = Group