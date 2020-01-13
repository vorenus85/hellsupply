const { Router } = require('express')
const router = Router({ mergeParams: true })
const { ObjectID } = require('mongodb')

router.get('/activeProducts', async function({ app: { locals } }, res) {
  const query = { active: 1 }
  const products = locals.products
  const activeProducts = await products.find(query).toArray()
  res.json(activeProducts)
})

router.get('/', async function({ app: { locals } }, res) {
  const products = locals.products
  let allProducts = []
  try {
    allProducts = await products.find({}).toArray()
  } catch (e) {
    console.error(e)
  }
  res.json(allProducts)
})

router
  .route('/:id')
  .get(function(req, res, next) {
    const id = req.params.id
    res.json(id)
  })
  .delete(function(
    {
      app: {
        locals: { products }
      },
      params: { id }
    },
    res,
    next
  ) {
    console.log(id)
    // eslint-disable-next-line no-undef,handle-callback-err
    products.deleteOne({ _id: ObjectID(id) }, function(err, results) {})
    res.json({ success: id })
  })

module.exports = router
