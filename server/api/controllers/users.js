const { Router } = require('express')
const router = Router({ mergeParams: true })
const { ObjectID } = require('mongodb')
router
  .route('/')
  .get((_, res) => res.send('LIST USERS'))
  .post(({ body }, res) =>
    res.send(`CREATE USER WITH PARAMETERS: ${JSON.stringify(body)}`)
  )

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
    } catch (e) {
      console.error(e)
    }
    res.json(_res)
  }
)

router.get('/listInactiveUsers', async function({ app: { locals } }, res) {
  const query = { active: false, role: 'user' }
  const users = locals.users
  const inactiveUsers = await users.find(query).toArray()
  res.json(inactiveUsers)
})

router.get('/listActiveUsers', async function({ app: { locals } }, res) {
  const query = { active: true, role: 'user' }
  const users = locals.users
  const activeUsers = await users.find(query).toArray()
  res.json(activeUsers)
})

router
  .route('/modifyState/:id/:userState')
  .put(async function({ app: { locals }, params: { id, userState } }, res) {
    console.dir(typeof userState)
    console.dir(userState)
    let query = { active: true }
    if (userState === 'false') {
      query = { active: false }
    }
    const users = locals.users
    const modifyUserState = await users.updateOne(
      { _id: ObjectID(id) },
      { $set: query }
    )
    console.dir(id)
    res.json(modifyUserState)
  })

router
  .route('/:id')
  .get(function(req, res, next) {
    const id = req.params.id
    res.json(id)
  })
  .post(() => {})
  .delete(function(
    {
      app: {
        locals: { users }
      },
      params: { id }
    },
    res,
    next
  ) {
    console.log(id)
    // eslint-disable-next-line no-undef,handle-callback-err
    users.deleteOne({ _id: ObjectID(id) }, function(err, results) {})
    res.json({ success: id })
  })

router
  .route('/:id')
  .get(({ params: { id } }, res) => res.send(`GET USER WITH ID: ${id}`))
  .put(({ params: { id }, body }, res) =>
    res.send(`UPDATE USER (${id}) WITH PARAMETERS: ${JSON.stringify(body)}`)
  )

module.exports = router
