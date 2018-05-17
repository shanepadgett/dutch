// Dependencies
//==================================
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const exphbs = require('express-handlebars')

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
app.use(express.static('public'))

// Routes
//==================================
require('./routes/website-routes')(app)
require('./routes/receipt-routes')(app)
require('./routes/user-routes')(app)
require('./routes/item-routes')(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
