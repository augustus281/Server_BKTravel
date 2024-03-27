'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const User = require("./user.model")

class TourGuide extends User {}
TourGuide.init({}, { sequelize, modelName: 'tourguide'})

module.exports = TourGuide

