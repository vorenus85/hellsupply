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
    pino.info('Inserting example user (admin:admin)')
    try {
      users.insertOne({
        name: "It's A Admin",
        email: 'admin@admin.com',
        password:
          '$2b$15$gHNKCQPydZ/R.ZH/nqOmm.zGalFn/UuYEV4tUkfsGHBpIgQx9tUyG',
        role: 'admin',
        active: true
      })
      pino.info('Example user (admin:admin) inserted successfully')
    } catch (e) {
      pino.error(e, 'Cannot insert example user')
    }
    client.close()
  }
)
