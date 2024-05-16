'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/connect.mysql")
const User = require("./user.model")
const { RoleUser } = require("../common/status")
const bcrypt = require('bcrypt');

class TourGuide extends User {}
TourGuide.init({
    tour_guide_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [10-12]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expired_time_code: {
        type: DataTypes.DATE,
        allowNull: true
    },
    role_user: {
        type: DataTypes.ENUM(RoleUser.GUIDER),
        allowNull: false
    },
    access_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    
}, { sequelize, modelName: 'tour_guide'})

const createTourGuideDefault = async () => {
    try {
        const tourGuides = [
            { email: 'tourguide1@bktravel.com', password: 'tourguide@123', role_user: RoleUser.TOUR_GUIDE },
            { email: 'tourguide2@bktravel.com', password: 'tourguide@123', role_user: RoleUser.TOUR_GUIDE },
            { email: 'tourguide3@bktravel.com', password: 'tourguide@123', role_user: RoleUser.TOUR_GUIDE },
        ]

        for (const tourGuide of tourGuides) {
            const existTourGuide = await TourGuide.findOne({ where: { email: tourGuide.email } });
            if (!existTourGuide) {
                const hashedPassword = await bcrypt.hash(guide.password, 10);
                const tourGuideInstance = new TourGuide({
                    email: tourGuide.email,
                    password: hashedPassword,
                    role_user: tourGuide.role_user,
                });

                await tourGuideInstance.save();
            }
        }
    } catch (error) {
        throw new Error("Error: ", error)
    }
}

createTourGuideDefault()

module.exports = TourGuide

