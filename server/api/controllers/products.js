const { Router } = require('express')
const router = Router({ mergeParams: true })
const { ObjectID } = require('mongodb')

router.get('/activeProducts', async function({ app: { locals } }, res) {
  const query = { active: true }
  const products = locals.products
  try {
    const activeProducts = await products.find(query).sort({name:1}).toArray()
    res.json(activeProducts)
  } catch (e) {
    console.error(e)
  }
})

router.get('/selectedProduct', async function({ app: { locals } }, res) {
  const query = { name: 'Classic' }
  const products = locals.products
  try {
    const defaultProduct = await products.find(query).toArray()
    res.json(defaultProduct)
  } catch (e) {
    console.error(e)
  }
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
    try {
      const insertProduct = await products.insertOne(query)
      res.json(insertProduct)
    } catch (e) {
      console.error(e)
    }
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
    try {
      const modifyProduct = await products.updateOne(
        { _id: ObjectID(id) },
        { $set: query }
      )
      res.json(modifyProduct)
    } catch (e) {
      console.error(e)
    }
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
    try {
      products.deleteOne({ _id: ObjectID(id) }, function(err, results) {})
      res.json({ success: id })
    } catch (e) {
      console.error(e)
    }
  })

module.exports = router
