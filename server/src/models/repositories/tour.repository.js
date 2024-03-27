'use strict'

const Tour = require("../tour.model")

const findTourById = async (tour_id) => {
    return await Tour.findOne({ where: { tour_id }})
}

module.exports = {
    findTourById
}