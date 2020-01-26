const { Router } = require('express')
const router = Router({ mergeParams: true })

router
  .route('/')
  .get(async function({ app: { locals, body } }, res) {
    const query = body
    const periods = locals.periods
    let allPeriods= []
    try {
      allPeriods = await periods.find(query).toArray()
    } catch (e) {
      console.error(e)
    }
    res.json(allPeriods)
  })
  .post(async function({ app: { locals }, body }, res) {
    const query = body
    const periods = locals.periods
    try {
      const insertPeriods = await periods.insertOne(query)
      res.json(insertPeriods)
    } catch (e) {
      console.error(e)
    }
  })

router
  .route('/actual/:currentTime')
  .get(async function({ app: { locals }, params: { currentTime }, body }, res) {
    console.log(currentTime)
    const query = {
      periodStart: {
        $lt: parseInt(currentTime)
      },
      periodEnd: {
        $gte: parseInt(currentTime)
      }
    }
    const periods = locals.periods
    let actualPeriod = []
    try {
      actualPeriod = await periods.find(query).toArray()
    } catch (e) {
      console.error(e)
    }
    res.json(actualPeriod)
  })

module.exports = router
