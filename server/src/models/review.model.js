'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const Comment = require("./comment.model")

class Review extends Model {}
Review.init({
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    rating_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    rating_3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    rating_4: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    rating_5: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    average_rate: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
        defaultValue: 0.0
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, { sequelize, modelName: "review" })

Review.hasMany(Comment, { foreignKey: "review_id" })
module.exports = Review