require('dotenv-flow').config()
const consola = require('consola')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const { MongoClient } = require('mongodb')
const { pino, apiMW } = require('../logger')
const router = require('./router')

const MONGODB_URI = process.env.MONGODB_URI
let MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_DB) {
  let uriSplit = MONGODB_URI.split('/')
  uriSplit = uriSplit[uriSplit.length - 1].split('?')
  MONGODB_DB = uriSplit[0]
}

pino.info('API setup...')
const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(apiMW)
app.use(router)

MongoClient.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      consola.error({
        ...err,
        message: `MongoDB not connected`,
        badge: true
      })
      pino.error(err, 'API setup failed')
      return
    }
    const db = client.db(MONGODB_DB)
    app.locals.mongo = db
    app.locals.users = db.collection('users')
    app.locals.orders = db.collection('orders')
    consola.ready({
      message: `MongoDB connected`,
      badge: true
    })
    pino.info('API setup succeded')
  }
)

module.exports = app
