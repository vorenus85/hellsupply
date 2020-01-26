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

module.exports = router
