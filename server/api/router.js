const { Router } = require('express')
const router = Router({ mergeParams: true })
const authController = require('./controllers/auth')
const usersController = require('./controllers/users')

router.use('/auth', authController)
router.use('/users', usersController)

module.exports = router
