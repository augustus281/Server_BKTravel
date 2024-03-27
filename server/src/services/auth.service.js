'use strict'

const OAuth2Account = require("../models/admin.model")
const jwt = require("jsonwebtoken")

const createAccessToken = (user, expiresIn = '30m') => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: expiresIn
    })
}

const createRefreshToken = (user, expiresIn = '7d') => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: expiresIn
    })
}


const loginSuccessService = (account_id) => new Promise(async(resolve, reject) => {
    try {
        const respones = await OAuth2Account.findOne({
            where: {account_id}
        })
        console.log(respones)
        resolve(respones)
    } catch (error) {
        reject({
            message: 'Fail at auth server' + error
        })
    }
})

module.exports = {
    loginSuccessService,
    createAccessToken,
    createRefreshToken
}