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
    const products = db.collection('products')
    pino.info('Inserting example products')
    try {
      products.insertMany([
        {
          name: 'Ice Cool Guava-Yuzu',
          price: '125',
          active: true,
          image:
            'https://fw.photos/QKelCjjirgnk6PS0P3g624XgAuM=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-ic-guava-yuzu-250-ed-5dc28951e9c63.png'
        },
        {
          name: 'Ice Cool Cherry-Grape',
          price: '125',
          active: true,
          image:
            'https://fw.photos/Ed9a2KlIXrMH1fuAHo76gJF-hJE=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-ic-cherry-grape-250-ed-5dc288853bb62.png'
        },
        {
          name: 'Classic',
          price: '125',
          active: true,
          image:
            'https://fw.photos/qQahGtSn2pUX-4tjOURbQw6bkC8=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-classic-250-ed-02-5cb7358da4c00.png'
        },
        {
          name: 'Strong Apple',
          price: '125',
          active: true,
          image:
            'https://fw.photos/8fQppCPmIK_U2VFU6mTie7UkVl8=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-strong-apple-250-ed-02-5cd4371c7b282-5cdbe4fdd6644.png'
        },
        {
          name: 'Strong Red Grape',
          price: '125',
          active: true,
          image:
            'https://fw.photos/ULVVi34djlvY2AXvdr1pW_yGfi4=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-strong-redgrape-250-ed-02-5cd4372f3538c-5cdbe4c5b8012.png'
        },
        {
          name: 'Zero',
          price: '125',
          active: true,
          image:
            'https://fw.photos/tmTf-7ysT13dUGK2dTdgHr_sjNU=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fbf34f881552fbc2bfee74519ab59793a-5cb5cb1a4024e.png'
        },
        {
          name: 'Zero Strawberry',
          price: '125',
          active: true,
          image:
            'https://fw.photos/8UNUVGAbf9hFYGcjVdHDjF-b_mI=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Ff4dee4ef380973c6fb43cceedf1c7858-5cb5caff79923.png'
        },
        {
          name: 'Strong Focus',
          price: '125',
          active: false,
          image:
            'https://fw.photos/Ig9psDzXUIHzh9HfEJIJSf4eH24=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-strong-focus-250-ed-02-1-5cb737e12873f.png'
        }
      ])
      pino.info('Example products inserted successfully')
    } catch (e) {
      pino.error(e, 'Cannot insert example products')
    }
    client.close()
  }
)
