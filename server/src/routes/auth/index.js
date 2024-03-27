'use strict'
const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const authController = require("../../controllers/auth.controller")
const passport = require("passport")

router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.post('/forgotPassword', asyncHandler(authController.forgotPassword))

// OAuth2
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))
// router.get("/google/callback", (req, res, next) => {
//     passport.authenticate('google', (err, profile) => {
//         req.user = profile
//         next()
//     })(req, res, next)
// }, (req, res) => {
//     res.redirect(`${process.env.URL_CLIENT}/auth/login-success/${req.user?.id}`)
// })
// router.get("/google/callback", asyncHandler(authController.oauth2GoogleCallback))
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.status(200).json({
            message: "Successfully!"
        })
    }
  )

router.get("/google/redirect", asyncHandler(authController.oauth2GoogleLogin))

router.post("/login-success/:id", authController.loginSuccess)

module.exports = router