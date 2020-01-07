const { Router } = require('express')
const router = Router({ mergeParams: true })

router.get('/activeProducts', async function({ app: { locals } }, res) {
  const query = { active: 1 }
  const products = locals.products
  const activeProducts = await products.find(query).toArray()
  res.json(activeProducts)
})

module.exports = router
