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

module.exports = router
