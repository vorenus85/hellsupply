const { Router } = require('express')
const router = Router({ mergeParams: true })
const mongo = require('mongodb')

router
  .route('/')
  .get((_, res) => res.send('LIST USERS'))
  .post(({ body }, res) =>
    res.send(`CREATE USER WITH PARAMETERS: ${JSON.stringify(body)}`)
  )

// test api: curl -i -H "Accept: application/json" localhost:8787/api/users/inactiveUsers

router.get('/inactiveUsers', async function({ app: { locals } }, res) {
  const query = { active: false, role: 'user' }
  const users = locals.users
  const inactiveUsers = await users.find(query).toArray()
  res.json(inactiveUsers)
})

router.get('/activeUsers', async function({ app: { locals } }, res) {
  const query = { active: true, role: 'user' }
  const users = locals.users
  const activeUsers = await users.find(query).toArray()
  res.json(activeUsers)
})

router.post('/post/:id', function(req, res, next) {
  const id = req.params.id
  res.json(id)
})

router.put('/put/:id', function(req, res, next) {
  const id = req.params.id
  res.json(id)
})

router.get('/get/:id', function(req, res, next) {
  const id = req.params.id
  res.json(id)
})

/* DELETE USER */
router.delete('/deleteUser/:id', function(req, res, next) {
  const id = req.params.id
  console.log(id)
  // eslint-disable-next-line no-undef
  const db = client.db(MONGODB_DB)
  const collection = db.get().collection('users')
  // eslint-disable-next-line handle-callback-err
  collection.deleteOne({ _id: new mongo.ObjectId(id) }, function(
    err,
    results
  ) {})
  res.json({ success: id })
})

router
  .route('/:id')
  .get(({ params: { id } }, res) => res.send(`GET USER WITH ID: ${id}`))
  .put(({ params: { id }, body }, res) =>
    res.send(`UPDATE USER (${id}) WITH PARAMETERS: ${JSON.stringify(body)}`)
  )

module.exports = router
