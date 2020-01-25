const { Router } = require('express')
const router = Router({ mergeParams: true })
const { ObjectID } = require('mongodb')
const bcrypt = require('bcrypt')

router
  .route('/')
  .get((_, res) => res.send('LIST USERS'))
  .post(async function({ app: { locals }, params: { id }, body }, res) {
    let result = { success: false, message: 'Unknown error'}
    const query = body
    const users = locals.users
    let tryInsert = true

    const email = body.email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(email)) {
    } else {
      tryInsert = false
      result = { success: false, message: 'E-mail must be valid!'}
    }

    try {
      const pwd = await bcrypt.hash(body.password, 15)
      query.password = pwd
    } catch (e) {
      console.error(e)
    }

    try {
      const user = await locals.users.findOne({ email: body.email })
      if(user) {
        result = { success: false, message: 'That email address is already in use, please use a different email address!'}
        tryInsert = false
      }
    } catch (e) {
      console.error(e)
    }

    if(tryInsert) {
      try {
        await users.insertOne(query)
        result = { success: true, message: 'Succesfully register! Please wait for activate!'}
      } catch (e) {
        console.error(e)
      }
    }
    res.json(result)
  })

// test api: curl -i -H "Accept: application/json" localhost:8787/api/users/inactiveUsers

router.get(
  '/all',
  async (
    {
      app: {
        locals: { users }
      }
    },
    res
  ) => {
    let _res = []
    try {
      _res = await users.find({}).toArray()
      res.json(_res)
    } catch (e) {
      console.error(e)
    }
  }
)

router.get('/listInactiveUsers', async function({ app: { locals } }, res) {
  const query = { active: false, role: 'user' }
  const users = locals.users
  try {
    const inactiveUsers = await users.find(query).toArray()
    res.json(inactiveUsers)
  } catch (e) {
    console.error(e)
  }
})

router.get('/listActiveUsers', async function({ app: { locals } }, res) {
  const query = { active: true, role: 'user' }
  const users = locals.users
  try {
    const activeUsers = await users.find(query).toArray()
    res.json(activeUsers)
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
    const users = locals.users
    try {
      const modifyUser = await users.updateOne(
        { _id: ObjectID(id) },
        { $set: query }
      )
      res.json(modifyUser)
    } catch (e) {
      console.error(e)
    }
  })
  .post(() => {})
  .delete(async function(
    {
      app: {
        locals: { users }
      },
      params: { id }
    },
    res
  ) {
    try {
      console.log(id)
      // eslint-disable-next-line no-undef,handle-callback-err
      await users.deleteOne({ _id: ObjectID(id) }, function(err, results) {})
      res.json({ success: id })
    } catch (e) {
      console.error(e)
    }
  })

router
  .route('/:id')
  .get(({ params: { id } }, res) => res.send(`GET USER WITH ID: ${id}`))
  .put(({ params: { id }, body }, res) =>
    res.send(`UPDATE USER (${id}) WITH PARAMETERS: ${JSON.stringify(body)}`)
  )

module.exports = router
