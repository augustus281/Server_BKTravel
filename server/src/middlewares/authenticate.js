'use strict'

const jwt = require('jsonwebtoken')

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

const isAdmin = async (token) => {
    const decodeUser = jwt.decode(token)
    const role_user = decodeUser['role_user']
    if (role === role_user) return true;
} 

module.exports = {
    authenticate,
    isAdmin
}