const { Router } = require('express')
const router = Router({ mergeParams: true })

router
  .route('/')
  .get((_, res) => res.send('LIST USERS'))
  .post(({ body }, res) =>
    res.send(`CREATE USER WITH PARAMETERS: ${JSON.stringify(body)}`)
  )

router
  .route('/:id')
  .get(({ params: { id } }, res) => res.send(`GET USER WITH ID: ${id}`))
  .put(({ params: { id }, body }, res) =>
    res.send(`UPDATE USER (${id}) WITH PARAMETERS: ${JSON.stringify(body)}`)
  )

// TODO undefinedet ad vissza
router.get('/administration/inactiveUsers', function({ app: { locals } }, res) {
  const query = { active: false }
  const users = locals.users
  const inactUsers = users.find(query)
  res.json(inactUsers)
})

module.exports = router
