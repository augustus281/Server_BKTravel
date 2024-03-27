'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const Tour = require("./tour.model")
const Attraction = require("./attraction.model")

class AttractionTour extends Model {}
AttractionTour.init({
    attraction_tour_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    attraction_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize, modelName: "attraction_tour" })

Tour.belongsToMany(Attraction, { through: AttractionTour, foreignKey: "tour_id" })
Attraction.belongsToMany(Tour, { through: AttractionTour, foreignKey: "attraction_id" })

module.exports = AttractionTour