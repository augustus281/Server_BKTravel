'use strict'

const { DataTypes } = require("sequelize");
const sequelize = require("../database/connect.mysql");

const Token = sequelize.define('token', {
    privateKey: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicKey: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshTokensUsed: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: [],
        // convert JSON to array
        get() {
            const value = this.getDataValue('refreshTokenUsed');
            return value ? JSON.parse(value) : [];
        },
        // convert array to JSON
        set() {
            this.setDataValue('refreshTokenUsed', value ? JSON.stringify(value): null)
        }

    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
})


module.exports = Token
