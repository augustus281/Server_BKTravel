'use strict'

const Tour = require("../models/tour.model")

const findTourById = async(tour_id) => {
    return await Tour.findOne({ where: { tour_id: tour_id }})
}

const findIdByNameTour = async(name_tour) => {
    return await Tour.findOne({ where: { name: name_tour }})
}

module.exports = {
    findTourById,
    findIdByNameTour
}