const path = require('path')
const fs = require('fs')

export const supportedFileTypes = ['.txt', '.md', '.html']

export const checkFileExtname = (filePath) => {
  const ext = path.extname(filePath)
  return supportedFileTypes.includes(ext)
}

export const checkFileIsExist = (filepath) => {
  return fs.existsSync(filepath) && !fs.lstatSync(filepath).isDirectory()
}

export const isFileLegal = (filePath) => {
  if (!checkFileIsExist(filePath)) {
    return 'File does not exist'
  }
  if (!checkFileExtname(filePath)) {
    return `Formats other than ${supportedFileTypes.join('、')} are not supported`
  }

  return null
}
