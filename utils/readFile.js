const fs = require('fs')
const { red } = require('kolorist')

export const readFile = argvPath => {
  // 1.文件路径必须存在
  if (!fs.existsSync(argvPath)) {
    throw new Error(red('✖ ') + argvPath + ' Non-existent')
  }
  // 2.同步读取文件内容
  return fs.readFileSync(argvPath, { encoding: 'utf8' })
}
