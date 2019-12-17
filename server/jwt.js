const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const verify = (given) => {
  return new Promise((resolve, reject) => {
    jwt.verify(given, SECRET, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

const sign = (data) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      SECRET,
      { algorithm: 'HS512', expiresIn: '12h' },
      (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      }
    )
  })
}

module.exports = { verify, sign }
