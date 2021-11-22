const path = require('path')
const { red } = require('kolorist')
const isAbsolute = require('is-absolute')

export const getAbsolute = (argvPath, cwd) => {
  if (isAbsolute(argvPath)) return argvPath
  return path.resolve(cwd, argvPath)
}

export const getPath = (argvPath, cwd) => {
  if (!argvPath || typeof argvPath !== 'string') {
    throw new Error(red('✖') + ' The command line argument --file-path or --path or --p must be commanded')
  }
  return getAbsolute(argvPath, cwd)
}
