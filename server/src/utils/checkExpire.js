'use strict'

const moment = require("moment")

const isExpired = async (time) => {
    const now = moment()
    const expire_time = moment(time)
    return now.isBefore(expire_time)
}

module.exports = {
    isExpired
} 