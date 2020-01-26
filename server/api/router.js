const { Router } = require('express')
const router = Router({ mergeParams: true })
const authController = require('./controllers/auth')
const usersController = require('./controllers/users')
const productsController = require('./controllers/products')
const ordersController = require('./controllers/orders')
const orderItemsController = require('./controllers/orderItems')

router.use('/auth', authController)
router.use('/users', usersController)
router.use('/products', productsController)
router.use('/orders', ordersController)
router.use('/orderItems', orderItemsController)

module.exports = router
