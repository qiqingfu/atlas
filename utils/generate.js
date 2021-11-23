const fs = require('fs')
const path = require('path')
const request = require('request')

const join = (name, ext) => name + '.' + ext

export const downLoadImageToLocal = (data, targetDir) => {
  data.forEach(({ src, fileName, extname }) => {
    request(src)
      .pipe(fs.createWriteStream(path.resolve(targetDir,join(fileName, extname))))
  })
}