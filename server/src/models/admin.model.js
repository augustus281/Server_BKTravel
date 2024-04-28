'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/connect.mysql")
const User = require("./user.model")

class Admin extends User {}
Admin.init({
    
}, { sequelize, modelName: 'admin'})

module.exports = Admin

