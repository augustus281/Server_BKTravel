'use strict'

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/connect.mysql")

const { StatusTour } = require("../common/status");
const OrderItem = require("./order_item.model");
const Comment = require("./comment.model");
const Review = require("./review.model");
const Group = require("./group.model");
const Notification = require("./notification.model")

class Tour extends Model {}
Tour.init({
    tour_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cover_image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    list_image: {
        type: DataTypes.JSON,
        allowNull: true
    },
    description_place: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM(StatusTour.WAITING, StatusTour.ONLINE, StatusTour.DELETED,
        StatusTour.PENDING, StatusTour.SUCCESS, StatusTour.REJECT),
        defaultValue: StatusTour.WAITING,
    }, 
    current_customers: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    max_customer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    departure_place: {
        type: DataTypes.STRING,
        allowNull: true
    },
    departure_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    destination_place: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    booked_number : {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    time: {
        type: DataTypes.STRING,
        allowNull: true
    },
    departure_time: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deadline_book_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    average_rate: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: true,
        defaultValue: 0.0
    },
    count_reviewer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    highlight: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},  { sequelize, modelName: 'tour' })

Tour.hasMany(OrderItem, { foreignKey: "tour_id" })
Tour.hasMany(Comment, { foreignKey: "tour_id" })
Tour.hasMany(Review, { foreignKey: "tour_id" })
Tour.hasOne(Group, { foreignKey: "tour_id" })
Tour.hasMany(Notification, { foreignKey: "tour_id" })

module.exports = Tour