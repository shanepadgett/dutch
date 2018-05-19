module.exports = app => {
  app.get('/', (_, res) => {
    res.render('index', { title: 'Divvy Up' })
  })

  app.get('/receipts', (_, res) => {
    res.render('receipts')
  })
}