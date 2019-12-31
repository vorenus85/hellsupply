const { Router } = require('express')
const router = Router({ mergeParams: true })
const bcrypt = require('bcrypt')
const moment = require('moment')
const { ObjectId } = require('mongodb')
const { pino } = require('../../logger')
const { sign, verify } = require('../../jwt')

const _removeAuthCookie = (res) => {
  res.clearCookie('token')
}

const _setAuthCookie = (token, res) => {
  res.cookie('token', token, {
    httpOnly: true,
    expires: moment()
      .utc()
      .add('12', 'hours')
      .toDate()
  })
}

router.post('/login', async ({ body, app: { locals } }, res) => {
  const result = { success: false, userData: null }
  if (!body || !body.email || !body.password) {
    _removeAuthCookie(res)
    return res.json(result)
  }
  const user = await locals.users.findOne({ email: body.email })
  if (!user) {
    _removeAuthCookie(res)
    return res.json(result)
  }
  try {
    const samePWD = await bcrypt.compare(body.password, user.password)
    if (samePWD) {
      result.success = true
      result.userData = {
        ...user
      }
      result.userData.id = user._id
      delete result.userData.password
      delete result.userData._id
      const token = await sign(result.userData)
      _setAuthCookie(token, res)
    }
  } catch (e) {
    _removeAuthCookie(res)
    pino.error(e, 'Password compare error')
    result.success = false
    result.userData = null
  }
  res.json(result)
})

router.get('/autologin', async ({ cookies, app: { locals } }, res) => {
  const { token } = cookies
  const result = { success: false }
  if (token) {
    try {
      const decoded = await verify(token)
      if (decoded) {
        const user = await locals.users.findOne({ _id: ObjectId(decoded.id) })
        if (user) {
          result.success = true
          result.userData = {
            ...user
          }
          result.userData.id = user._id
          delete result.userData.password
          delete result.userData._id
          return res.json(result)
        }
      }
    } catch (e) {
      if (!e.message.includes('expired')) {
        pino.error(e, 'Token verify error')
      }
    }
  }
  res.json(result)
})

router.get('/logout', (_, res) => {
  _removeAuthCookie(res)
  res.send('Logged out')
})

module.exports = router
