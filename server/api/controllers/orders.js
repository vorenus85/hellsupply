const { Router } = require('express')
const router = Router({ mergeParams: true })
const { ObjectID } = require('mongodb')

router
  .route('/')
  .get(async function({ app: { locals }, body }, res) {
    const query = body
    const orders = locals.orders
    let allOrders = []
    try {
      allOrders = await orders.find(query).toArray()
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

router
  .route('/byPeriod/:start/:end')
  .get(async function({ app: { locals }, params: { start, end }, body }, res) {
    const query = { timestamp: { $gte: parseInt(start), $lt: parseInt(end) } }
    const orders = locals.orders
    let ordersByPeriod = []
    try {
      ordersByPeriod = await orders.find(query).toArray()
    } catch (e) {
      console.error(e)
    }
    res.json(ordersByPeriod)
  })

router
  .route('/byEmail/:email')
  .get(async function({ app: { locals }, params: { email }, body }, res) {
    const query = { email }
    const orders = locals.orders
    let ordersByEmail = []
    try {
      ordersByEmail = await orders.find(query).toArray()
    } catch (e) {
      console.error(e)
    }
    res.json(ordersByEmail)
  })

router
  .route('/:id')
  .get(async function({ app: { locals }, params: { id }, body }, res) {
    // eslint-disable-next-line no-template-curly-in-string
    const query = { orderId: id }
    const orders = locals.orders
    try {
      // eslint-disable-next-line no-undef
      const order = await orders.find(query).toArray()
      res.json(order)
    } catch (e) {
      console.error(e)
    }
  })
  .delete(function(
    {
      app: {
        locals: { orders }
      },
      params: { id }
    },
    res,
    next
  ) {
    try {
      orders.deleteOne({ _id: ObjectID(id) }, function(err, results) {})
      res.json({ success: id })
    } catch (e) {
      console.error(e)
    }
  })

module.exports = router
