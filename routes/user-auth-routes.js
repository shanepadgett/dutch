const passport = require('passport')
const db = require('../models')

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL:
    process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback' //TODO: update with correct url
}

module.exports = app => {
  app.get(
    '/login',
    passport.authenticate('auth0', {
      clientID: env.AUTH0_CLIENT_ID,
      domain: env.AUTH0_DOMAIN,
      redirectUri: env.AUTH0_CALLBACK_URL,
      responseType: 'code',
      audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
      scope: 'openid email profile'
    }),
    function(req, res) {
      res.redirect('/')
    }
  )

  app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
  })

  app.get(
    '/callback',
    passport.authenticate('auth0', {
      failureRedirect: '/failure'
    }),
    function(req, res) {
      db.User.findOne({ //TODO: break out into user controller
        where: {
          authId: req.user.id
        }
      }).then(result => {
        if (result) {
          res.redirect(/*req.session.returnTo ||*/ '/dashboard')
        } else {
          db.User.create({
            authId: req.user.id,
            firstName: req.user.name.givenName,
            lastName: req.user.name.familyName,
            email: req.user.emails[0].value,
            displayName: req.user.nickname,
            avatar: req.user.picture
          })
            .then(data => res.redirect(/*req.session.returnTo ||*/ '/dashboard'))
            .catch(err => res.json(err))
        }
      })
    }
  )

  app.get('/failure', function(req, res) {
    var error = req.flash('error')
    var error_description = req.flash('error_description')
    req.logout()
    res.render('failure', {
      error: error[0],
      error_description: error_description[0],
    })
  })
}