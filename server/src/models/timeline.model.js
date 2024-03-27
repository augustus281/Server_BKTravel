'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")

const statusTimeline = {
    SKIP: 'skip',
    CHECK_IN: 'check_in',

}

const Timeline = sequelize.define("timeline", {
    timeline_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(statusTimeline.SKIP, statusTimeline.CHECK_IN)
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

module.exports = Timeline