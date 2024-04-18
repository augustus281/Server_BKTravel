const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy
const OAuth2Account = require("../models/oauth2_account.model")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/api/v1/auth/google`,
    // callbackURL: `/auth/google/callback`,
    passReqToCallback: true
},

    async function(request, access_token, refresh_token, profile, done) {
        // if (profile?.id) {
        //     const response = new OAuth2Account({
        //         account_id: profile.id,
        //         email: profile.email,
        //         provider: profile.provider,
        //         fullname: profile.displayName,
        //         firstName: profile.name.givenName,
        //         lastName: profile.name.familyName,
        //         avatar: profile.picture
        //     })

        //     console.log(`new account`, response)
        //     await response.save()
        // }

        // return done(null, profile)
        const new_user = {
            account_id: profile.id,
            email: profile.email,
            provider: profile.provider,
            fullname: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            avatar: profile.picture
        }

        try {
            let user = await OAuth2Account.findOne({
                where: {
                    account_id: profile.id
                }
            })
            if (user) 
                done(null, user)
            else {
                user = await OAuth2Account.create(new_user)
                done(null, user)
            }
        } catch (err) {
            console.log(err)
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

///
// used to deserialize the user
// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => done(err, user))
// })