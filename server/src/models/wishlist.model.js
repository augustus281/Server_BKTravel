'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/connect.mysql")

class Wishlist extends Model {}

Wishlist.init(
    {
        wishlist_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    { sequelize, modelName: 'wishlist' }
);

module.exports = Wishlist