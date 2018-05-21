// Dependencies
//==================================
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const session = require('express-session')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const flash = require('connect-flash')
const logger = require('morgan')
const exphbs = require('express-handlebars')

dotenv.load()

// This will configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile)
  }
)

passport.use(strategy)

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: 'views/partials'
})

// Setup engine to use handlebars
//==================================
app.engine('.hbs', hbs.engine)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')

// Setup middleware
//==================================
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'))

app.use(flash())

// Handle auth failure error messages
app.use(function(req, res, next) {
  if (req && req.query && req.query.error) {
    req.flash('error', req.query.error)
  }
  if (req && req.query && req.query.error_description) {
    req.flash('error_description', req.query.error_description)
  }
  next()
})

// Check logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true
  }
  next()
})

// Routes
//==================================
require('./routes/html-routes')(app)
require('./routes/receipt-api-routes')(app)
require('./routes/user-api-routes')(app)
require('./routes/item-api-routes')(app)
require('./routes/user-auth-routes')(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
