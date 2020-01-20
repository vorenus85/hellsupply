const { Router } = require('express')
const router = Router({ mergeParams: true })
const { ObjectID } = require('mongodb')

router.get('/activeProducts', async function({ app: { locals } }, res) {
  const query = { active: true }
  const products = locals.products
  const activeProducts = await products.find(query).toArray()
  res.json(activeProducts)
})

router.get('/selectedProduct', async function({ app: { locals } }, res) {
  const query = { name: 'Classic' }
  const products = locals.products
  const defaultProduct = await products.find(query).toArray()
  res.json(defaultProduct)
})

router
  .route('/')
  .get(async function({ app: { locals } }, res) {
    const products = locals.products
    let allProducts = []
    try {
      allProducts = await products.find({}).toArray()
    } catch (e) {
      console.error(e)
    }
    res.json(allProducts)
  })
  .post(async function({ app: { locals }, body }, res) {
    const query = body
    const products = locals.products
    const insertProduct = await products.insertOne(query)
    res.json(insertProduct)
  })

router
  .route('/:id')
  .get(function(req, res, next) {
    const id = req.params.id
    res.json(id)
  })
  .put(async function({ app: { locals }, params: { id }, body }, res) {
    const query = body
    const products = locals.products
    const modifyProduct = await products.updateOne(
      { _id: ObjectID(id) },
      { $set: query }
    )
    res.json(modifyProduct)
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
