const fs = require('fs')
const path = require('path')

export const postOrderDirectoryTraverse = (dir, dirCallback, fileCallback) => {
  for (let filename of fs.readdirSync(dir)) {
    const fullname = path.resolve(dir, filename)
    if (fs.lstatSync(fullname).isDirectory()) {
      postOrderDirectoryTraverse(fullname, dirCallback, fileCallback)
      dirCallback(fullname)
      continue
    }
    fileCallback(fullname)
  }
}