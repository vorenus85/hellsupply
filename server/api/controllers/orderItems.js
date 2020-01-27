const { Router } = require('express')
const router = Router({ mergeParams: true })

router
  .route('/')
  .get(async function({ app: { locals, body } }, res) {})
  .post(async function({ app: { locals }, body }, res) {
    const query = body
    const orderItems = locals.orderItems
    try {
      const insertOrderItems = await orderItems.insertMany(query)
      res.json(insertOrderItems)
    } catch (e) {
      console.error(e)
    }
  })

router
  .route('/aggregated/:periodStart/:periodEnd')
  .get(async function(
    { app: { locals }, params: { periodStart, periodEnd }, body },
    res
  ) {
    const query = [
      { $match: { orderTimestamp: { $gte: periodStart, $lte: periodEnd } } },
      {
        $group: {
          _id: '$orderItemName',
          orderId: { $first: '$orderId' },
          name: { $first: '$orderItemName' },
          image: { $first: 'orderItemImage' },
          price: { $first: '$orderItemPrice' },
          sumQuantity: {
            $sum: '$orderItemQuantity'
          }
        }
      }
    ]
    const orderItems = locals.orderItems
    try {
      const listAggregatedOrderItems = await orderItems.insertMany(query)
      res.json(listAggregatedOrderItems)
    } catch (e) {
      console.error(e)
    }
  })

router
  .route('/:id')
  .get(async function({ app: { locals }, params: { id }, body }, res) {
    const orderId = id
    const query = { orderId }
    try {
      // eslint-disable-next-line no-undef
      const orderItems = await locals.orderItems.find(query).toArray()
      res.json(orderItems)
    } catch (e) {
      console.error(e)
    }
  })
  .delete(async function(
    {
      app: {
        locals: { orderItems }
      },
      params: { id },
      body
    },
    res,
    next
  ) {
    const query = { orderId: id }
    try {
      // eslint-disable-next-line handle-callback-err
      const deletedOrderItems = await orderItems.deleteMany(query, function(
        err,
        results
      ) {})
      res.json(deletedOrderItems)
    } catch (e) {
      console.error(e)
    }
  })

module.exports = router
