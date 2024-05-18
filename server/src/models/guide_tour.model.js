'use strict'

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect.mysql');
const TourGuide = require('./tour_guide.model');
const Tour = require('./tour.model');

class GuideTour extends Model {}
GuideTour.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tour_guide_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, { sequelize, modelName: "guide_tour" })

TourGuide.belongsToMany(Tour, { through: GuideTour, foreignKey: "tour_guide_id" })
Tour.belongsToMany(TourGuide, { through: GuideTour, foreignKey: "tour_id" })

module.exports = GuideTour


