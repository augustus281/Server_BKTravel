'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")

class GroupMember extends Model {}
GroupMember.init({
    group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    joined_datetime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    left_datetime: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, { sequelize, modelName: "group_member" })

module.exports = GroupMember 