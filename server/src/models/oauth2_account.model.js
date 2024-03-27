'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")

const ProviderAccount = {
    GOOGLE: 'google',
    FACEBOOK: 'facebook'
}

const OAuth2Account = sequelize.define("oauth2_account", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    provider: {
        type: DataTypes.ENUM(ProviderAccount.FACEBOOK, ProviderAccount.GOOGLE),
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = OAuth2Account

