'use strict'

const { RoleUser } = require("../common/status");
const GuideTour = require("../models/guide_tour.model");
const TourGuide = require("../models/tour_guide.model");
const { findTourById } = require("../services/tour.service")
const bcrypt = require('bcrypt');

const role_user = {
    ADMIN: 'admin',
    GUIDER: 'guider',
    CUSTOMER: 'customer'
}

class TourGuideController {
    assignTourToTourGuide = async (req, res, next) => {
        try {
            const { tour_id, tour_guide_id } = req.body
            const tour = await findTourById(tour_id);
            if (!tour) {
                return res.status(404).json({ message: "Not found to assign!" })
            }
            await GuideTour.create({
                tour_id, tour_guide_id
            })
            return res.status(200).json({
                message: "Assign tour for tour guide successfully!"
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    responseTask = async (req, res, next) => {
        try {
            const { tour_id, reason, tour_guide_id } = req.body
            const guideTour = await GuideTour.findOne({
                where: {
                    tour_id, 
                    tour_guide_id
                }
            })

            if (!guideTour) {
                return res.status(404).json({ message: "Not found tour is assigned!" })
            }

            // TODO

            return res.status(200).json({ message: "Response task successfully!" })
        } catch (error) { 
            return res.status(500).json({
                message: error.message
            })
        }
    }

    getAllTourGuide = async (req, res, next) => {
        try {
            const allTourGuides = await TourGuide.findAll()
            return res.status(200).json({
                message: "Get all tour guides successfully!",
                data: allTourGuides
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    createTourGuideDefault = async (req, res, next) => {
        try {
            const tourGuides = [
                { email: 'tourguide1@bktravel.com', password: 'tourguide@123', role_user: role_user.GUIDER },
                { email: 'tourguide2@bktravel.com', password: 'tourguide@123', role_user: role_user.GUIDER },
                { email: 'tourguide3@bktravel.com', password: 'tourguide@123', role_user: role_user.GUIDER },
            ]
    
            for (const tourGuide of tourGuides) {
                const existTourGuide = await TourGuide.findOne({ where: { email: tourGuide.email } });
                if (!existTourGuide) {
                    const hashedPassword = await bcrypt.hashSync(tourGuide.password, 10);
                    console.log(2)
                    const newTourGuide = await TourGuide.create({
                        email: tourGuide.email,
                        password: hashedPassword,
                        role_user: tourGuide.role_user,
                    });
                }
            }

            return res.status(201).json({
                message: "Create tour guide accoutn successfully!"
            })
        } catch (error) {
            throw new Error("Error: ", error.message)
        }
    }
}

module.exports = new TourGuideController()