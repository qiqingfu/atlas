const path = require('path')
const { red } = require('kolorist')
const isAbsolute = require('is-absolute')

const { isFileLegal } = require('./checkFile')

export const getAbsolute = (argvPath, cwd) => {
  if (isAbsolute(argvPath)) return argvPath
  return path.resolve(cwd, argvPath)
}

export const getFilePath = (argvPath, cwd) => {
  if (!argvPath) return argvPath

  const originFilePath = getAbsolute(argvPath, cwd)
  const errorMsg = isFileLegal(originFilePath)

  if (typeof errorMsg === 'string') {
    throw new Error(red('✖') + ' ' + errorMsg)
  }

  return originFilePath
}
