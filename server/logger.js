const devConfig = {
  prettyPrint: {
    colorize: true
  },
  redact: ['req', 'res']
}

const pino = require('pino')(
  process.env.NODE_ENV === 'development'
    ? { module: 'GENERAL', ...devConfig }
    : { module: 'GENERAL' }
)

const expressPino = require('express-pino-logger')
const expMW = expressPino(
  process.env.NODE_ENV === 'development'
    ? { module: 'EXPMW', ...devConfig }
    : { module: 'EXPMW' }
)

const api = pino.child({
  module: 'API'
})
const apiMW = expressPino(
  process.env.NODE_ENV === 'development'
    ? { module: 'APIMW', ...devConfig }
    : { module: 'APIMW' }
)

module.exports = { pino, expMW, api, apiMW }
