'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")

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
    }
}, { sequelize, modelName: "group" })

module.exports = Group