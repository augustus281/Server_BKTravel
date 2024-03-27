'use strict'

const Destination = require("../models/destination.model")
const Attraction = require("../models/attraction.model")
const fs = require("fs")
const path = require('path');
const { checkExistDestination } = require("../services/destination.service")
const jsonFilePath = path.join(__dirname, '../data', 'destination_data.json');

class DestinationController {

    loadDestinationsFromJsons = async(req, res, next) => {
        const data = await fs.readFileSync(jsonFilePath, 'utf-8')
        const jsonData = JSON.parse(data)

        const destinations = await Promise.all(jsonData.destinations.map(async destinationData => {
            const destination = await checkExistDestination(destinationData.name)

            if (!destination) {
                const dest = await Destination.create({ name: destinationData.name})
                console.log(`11111`, destinationData.attractions)
                await Promise.all(destinationData.attractions.map(async attractionName => {
                    const [attraction, createdAttraction] = await Attraction.findOrCreate({
                        where: { name: attractionName.name},
                        defaults: { name: attractionName.name, destination_id: dest.destination_id }
                    })
                }))
            } else {
                await Promise.all(destinationData.attractions.map(async attractionName => {
                    const [attraction, createdAttraction] = await Attraction.findOrCreate({
                        where: { name: attractionName.name},
                        defaults: { name: attractionName.name, destination_id: destination.destination_id }
                    })
                }))
            }
        }))
        return res.status(201).json({
            message: "Create successfully!"
        })
    }

    getAllDestinations = async(req, res, next) => {
        try {
            const all_destinations = await Destination.findAll({
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                }
            })
            return res.status(200).json({
                message: "Get all destinations successfully!",
                data: all_destinations
            })
        } catch(error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new DestinationController()