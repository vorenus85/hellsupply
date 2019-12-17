require('dotenv-flow').config()
const readline = require('readline')
const bcrypt = require('bcrypt')
const clearLineMagic = '\x1B[2K\x1B[200D'

const generate = (pwd) => {
  return bcrypt.hash(pwd, 15)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  historySize: 0
})

rl.stdoutMuted = true
rl.query = 'PWD: '
rl.question(rl.query, async function(password) {
  rl.history.slice(1)
  const hash = await generate(password)
  rl.output.write(clearLineMagic + 'HASH: ' + hash + '\n')
  rl.close()
})

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted) {
    rl.output.write(
      clearLineMagic +
        rl.query +
        '[' +
        (rl.line.length % 2 === 1 ? '=-' : '-=') +
        ']'
    )
  } else {
    rl.output.write(stringToWrite)
  }
}
