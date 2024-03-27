'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const Timeline = require("../models/timeline.model")
const Location = require("../models/location.model")

const TimelineLocation = sequelize.define("timeline_location", {
    timeline_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TimeLine,
            key: 'timeline_id'
        }
    },
    location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Location,
            key: 'location_id'
        }
    }
})

Timeline.belongsToMany(Location, { through: TimelineLocation })
Location.belongsToMany(Timeline, { through: TimelineLocation })

module.exports = TimelineLocation;