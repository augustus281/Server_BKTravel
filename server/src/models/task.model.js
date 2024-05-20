'use strict'

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect.mysql');
const Tour = require('./tour.model');
const User = require('./user.model');

class Task extends Model {}
Task.init({
    task_id: {
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
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, modelName: "task" })

User.belongsToMany(Tour, { through: Task, foreignKey: "user_id" })
Tour.belongsToMany(User, { through: Task, foreignKey: "tour_id" })

module.exports = Task


