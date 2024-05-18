'use strict'

const GuideTour = require("../models/guide_tour.model");
const { findTourById } = require("../services/tour.service")

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
}

module.exports = new TourGuideController()