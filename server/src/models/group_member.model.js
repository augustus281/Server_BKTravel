'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const User = require("./user.model")
const Group = require("./group.model")

class GroupUser extends Model {}
GroupUser.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
    
}, { sequelize, modelName: "group_user" })

Group.belongsToMany(User, { through: GroupUser, foreignKey: "group_id" })
User.belongsToMany(Group, { through: GroupUser, foreignKey: "user_id" })

module.exports = GroupUser