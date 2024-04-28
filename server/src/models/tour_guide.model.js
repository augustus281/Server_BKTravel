'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/connect.mysql")
const User = require("./user.model")

class TourGuide extends User {}
TourGuide.init({}, { sequelize, modelName: 'tourguide'})

module.exports = TourGuide

