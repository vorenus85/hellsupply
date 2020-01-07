require('dotenv-flow').config()
const { MongoClient } = require('mongodb')
const { pino } = require('./server/logger')
const MONGODB_URI = process.env.MONGODB_URI
let MONGODB_DB = process.env.MONGODB_DB
if (!MONGODB_DB) {
  let uriSplit = MONGODB_URI.split('/')
  uriSplit = uriSplit[uriSplit.length - 1].split('?')
  MONGODB_DB = uriSplit[0]
}
pino.info('Create DB connection', { MONGODB_URI, MONGODB_DB })
MongoClient.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      pino.error(err, `MongoDB not connected`)
      return
    }
    pino.info(`MongoDB connected`)
    const db = client.db(MONGODB_DB)
    const users = db.collection('users')
    pino.info('Inserting example users')
    try {
      users.insertMany([
        {
          id: 1,
          firstName: 'Some',
          lastName: 'User',
          email: 'someuser@hellsupply.com',
          password:
            '$2b$15$gHNKCQPydZ/R.ZH/nqOmm.zGalFn/UuYEV4tUkfsGHBpIgQx9tUyG',
          role: 'user',
          active: true
        },
        {
          id: 2,
          firstName: 'Somesome',
          lastName: 'User',
          email: 'someuser33@hellsupply.com',
          password:
            '$2b$15$gHNKCQPydZ/R.ZH/nqOmm.zGalFn/UuYEV4tUkfsGHBpIgQx9tUyG',
          role: 'user',
          active: false
        },
        {
          id: 3,
          firstName: 'Another',
          lastName: 'User',
          email: 'anotheruser@hellsupply.com',
          password:
            '$2b$15$gHNKCQPydZ/R.ZH/nqOmm.zGalFn/UuYEV4tUkfsGHBpIgQx9tUyG',
          role: 'user',
          active: false
        },
        {
          id: 4,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demouser@hellsupply.com',
          password:
            '$2b$15$gHNKCQPydZ/R.ZH/nqOmm.zGalFn/UuYEV4tUkfsGHBpIgQx9tUyG',
          role: 'user',
          active: false
        },
        {
          id: 5,
          firstName: 'Nobody',
          lastName: 'User',
          email: 'nobodyuser@hellsupply.com',
          password:
            '$2b$15$gHNKCQPydZ/R.ZH/nqOmm.zGalFn/UuYEV4tUkfsGHBpIgQx9tUyG',
          role: 'user',
          active: true
        }
      ])
      pino.info('Example users inserted successfully')
    } catch (e) {
      pino.error(e, 'Cannot insert example users')
    }
    client.close()
  }
)
