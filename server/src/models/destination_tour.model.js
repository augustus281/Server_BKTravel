'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/connect.mysql")
const Tour = require("./tour.model")
const Destination = require("./destination.model")

class DestinationTour extends Model {}
DestinationTour.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
    
}, { sequelize, modelName: "destination_tour" })

Tour.belongsToMany(Destination, { through: DestinationTour, foreignKey: "tour_id" })
Destination.belongsToMany(Tour, { through: DestinationTour, foreignKey: "destination_id" })

module.exports = DestinationTour