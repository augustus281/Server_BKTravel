'use strict'

const Group = require("../models/group.model")

const findGroupByID = async(group_id) => {
    return await Group.findOne({ where: { group_id: group_id }})
}

module.exports = {
    findGroupByID
}