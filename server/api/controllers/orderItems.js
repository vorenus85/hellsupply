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

module.exports = router
