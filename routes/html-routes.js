const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const {getReceipts} = require('../controllers/receipt-controller')
// const {getUserIdFromAuthId} = require('../controllers/user-controller')
const {getItemsByAssignee} = require('../controllers/item-controller')

const mapItemsToReceipts = (items) => {
  const receipts = []

  items.forEach(item => {
    let receiptIndex = receipts.findIndex(receipt => receipt.id === item.Receipt.id)

    if (receiptIndex === -1) {
      let newReceipt = {
        id: item.Receipt.id,
        receiptDate: item.Receipt.receiptDate,
        place: item.Receipt.place,
        subtotal: item.Receipt.subtotal,
        taxTotal: item.Receipt.taxTotal,
        tipTotal: item.Receipt.tipTotal,
        receiptTotal: item.Receipt.receiptTotal,
        allocTotal: 0.00,
        isReceiptPaid: false,
        items: []
      }
      receipts.push(newReceipt)
      receiptIndex = receipts.length - 1
    }

    let itemIndex = receipts[receiptIndex].items.findIndex(receiptItem => receiptItem.id === item.id)

    const itemTotal = parseFloat(item.price) + parseFloat(item.taxTip)

    receipts[receiptIndex].allocTotal += itemTotal

    if (itemIndex === -1) {
      const newItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        taxTip: item.taxTip,
        total: itemTotal.toFixed(2),
        isPaid: item.isPaid,
        assigneeId: item.assigneeId
      }
      receipts[receiptIndex].items.push(newItem)
    }
  })

  receipts.forEach(receipt => {
    receipt.allocTotal = parseFloat(receipt.allocTotal.toFixed(2))
    let isPaid = true
    receipt.items.forEach(item => {
      if (item.isPaid === false) {
        isPaid = false
      }
    })

    receipt.isReceiptPaid = isPaid
  })

  return receipts
}

module.exports = app => {
  app.get('/', (_, res) => {
    res.render('index')
  })

  app.get('/dashboard', ensureLoggedIn, (req, res) => {
    getItemsByAssignee(req.user.id).then(items => {
      const receipts = mapItemsToReceipts(items)
      
      res.render('dashboard', {
        user: req.user,
        receipts: receipts
      })
    })
  })

  app.get('/receipts', ensureLoggedIn, (req, res) => {
    getReceipts(req, res).then(receipts => res.render('receipts', {receipts: receipts}))
  })
}
