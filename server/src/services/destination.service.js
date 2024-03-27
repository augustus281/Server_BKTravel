'use strict'

const Destination = require("../models/destination.model")

const checkExistDestination = async (destination_name) => {
    return await Destination.findOne({
        where: { name: destination_name }
    })
}

module.exports = {
    checkExistDestination
}