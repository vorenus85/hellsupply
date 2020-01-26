const { Router } = require('express')
const router = Router({ mergeParams: true })

router
  .route('/')
  .get(async function({ app: { locals, body } }, res) {
    const query = body
    const orders = locals.orders
    let allOrders = []
    try {
      allOrders = await orders.find({ query }).toArray()
    } catch (e) {
      console.error(e)
    }
    res.json(allOrders)
  })
  .post(async function({ app: { locals }, body }, res) {
    const query = body
    const orders = locals.orders
    try {
      const insertOrders = await orders.insertOne(query)
      res.json(insertOrders)
    } catch (e) {
      console.error(e)
    }
  })

module.exports = router
