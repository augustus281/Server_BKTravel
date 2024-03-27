'use strict'

const Attraction = require("../models/attraction.model")
const Destination = require("../models/destination.model")

class AttractionController {
    getAllAttractionsByDestination = async(req, res, next) => {
        try {
            const { destination } = req.query
            const dest = await Destination.findOne({
                where: {
                    name: destination
                }
            })
    
            if (!dest) {
                return res.status(404).json({ message: "Not found destination." });
            }

            const attractions = await Attraction.findAll({
                where: { destination_id: dest.destination_id }
            })
    
            return res.status(200).json({
                message: "Get attractions successfully!",
                data: attractions
            });
        } catch(error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new AttractionController()