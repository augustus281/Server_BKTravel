'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/connect.mysql")
const Tour = require("./tour.model")

class Attraction extends Model {}

Attraction.init({
    attraction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    }, 
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { sequelize, modelName: 'attraction' })

Attraction.belongsTo(Tour)
module.exports = Attraction;