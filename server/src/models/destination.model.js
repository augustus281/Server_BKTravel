'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const Attraction = require("./attraction.model")

class Destination extends Model {}

Destination.init({
    destination_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { sequelize, modelName: 'destination' })


Destination.hasMany(Attraction, { foreignKey: 'destination_id' })
module.exports = Destination
