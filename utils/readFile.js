const fs = require('fs')
const { red } = require('kolorist')

export const readFile = argvPath => {
  if (!fs.existsSync(argvPath)) {
    throw new Error(red('✖ ') + argvPath + ' Non-existent')
  }
  return fs.readFileSync(argvPath, { encoding: 'utf8' })
}
