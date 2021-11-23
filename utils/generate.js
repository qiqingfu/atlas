const fs = require('fs')
const path = require('path')
const request = require('request')
const { postOrderDirectoryTraverse } = require('./directoryTraverse')

const join = (name, ext) => name + '.' + ext

const emptyDir = (root) => {
  postOrderDirectoryTraverse(
    root,
    dir => fs.rmdirSync(dir),
    file => fs.unlinkSync(file)
  )
}

export const downLoadImageToLocal = (data, targetDir) => {
  data.forEach(({ src, fileName, extname }) => {
    request(src)
      .pipe(fs.createWriteStream(path.resolve(targetDir,join(fileName, extname))))
  })
}

export const createRootDir = (root, shouldOverwrite) => {
  if (shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }
}