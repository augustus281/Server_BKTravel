'use strict'

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect.mysql');
const User = require('./user.model');
const Tour = require('./tour.model');

class UserTour extends Model {}
UserTour.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, { sequelize, modelName: "user_tour" })

User.belongsToMany(Tour, { through: UserTour, foreignKey: "user_id" })
Tour.belongsToMany(User, { through: UserTour, foreignKey: "tour_id" })

module.exports = UserTour


