'use strict'

const Attraction = require("../models/attraction.model");

const checkExistAttraction = async (attraction_name, dest_id) => {
    return await Attraction.findOne({
        where: { name: attraction_name, destination_id: dest_id }
    });
};


module.exports = {
    checkExistAttraction
}