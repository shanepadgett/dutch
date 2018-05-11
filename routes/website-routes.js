module.exports = app => {
  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Divvy Up' })
  })
}