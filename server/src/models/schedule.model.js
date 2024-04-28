'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/connect.mysql")
const Tour = require("./tour.model")

class Schedule extends Model {}
Schedule.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    schedule_detail: {
        type: DataTypes.JSON(),
        allowNull: false
    }
}, { sequelize, modelName: "schedule"} )

Schedule.belongsTo(Tour, { foreignKey: "tour_id" })

module.exports = Schedule