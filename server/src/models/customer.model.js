'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/connect.mysql")
const User = require("./user.model")

const levelUser = {
    COPPER: 'Đồng',
    SLIVER: 'Bạc',
    GOLD: 'Vàng',
    DIAMOND: 'Kim cương'
}

class Customer extends User {}
Customer.init({
    level: DataTypes.ENUM(levelUser.COPPER, levelUser.SLIVER, levelUser.GOLD, levelUser.DIAMOND),
    score: DataTypes.FLOAT
}, { sequelize, modelName: 'customer'})

module.exports = Customer

