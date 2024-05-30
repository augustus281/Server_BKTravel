'use strict'

const jwt = require('jsonwebtoken')
const { RoleUser } = require('../common')
const { AuthFailureError } = require('../core/error.response')

const HEADER = {
    AUTHORIZATION: 'authorization' 
}

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers[HEADER.AUTHORIZATION]
        if (!token || token === null || token === 'undefined')
            return res.status(400).json({ status: 'Unauthorized', message: "You don't have access"})

        const decodeUser = jwt.decode(token)
        req.user = decodeUser
        return next()
    } catch (error) {
        return res.status(500).json({ status: 'Fail', message: error.message })
    }
}

const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers[HEADER.AUTHORIZATION]
        if (!token || token === null || token === 'undefined')
            return res.status(400).json({ status: 'Unauthorized', message: "You don't have access"})

        const decodeUser = jwt.decode(token)
        if (decodeUser['role_user'] != RoleUser.ADMIN ) {
            throw new AuthFailureError("Invalid request!")
        }
        req.user = decodeUser
        return next()
    } catch (error) {
        return res.status(500).json({ status: 'Fail', message: error.message })
    }
}

const isAdmin = async (token) => {
    const decodeUser = jwt.decode(token)
    const role_user = decodeUser['role_user']
    if (RoleUser.ADMIN === role_user) return true;
} 

module.exports = {
    authenticate,
    authenticateAdmin,
    isAdmin
}