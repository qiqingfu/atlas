#!/usr/bin/env node
// @ts-check

const path = require('path')
const fs = require('fs')

const minimist = require('minimist')
const prompts = require('prompts')

const { red } = require('kolorist')
const { getFilePath } = require('./utils/getFilePath')
const { readFile } = require('./utils/readFile')
const { parse } = require('./utils/parse')
const { downLoadImageToLocal, createRootDir } = require('./utils/generate')
const { isFileLegal } = require('./utils/checkFile')

function canSafelyOverwrite(dir) {
  return !fs.existsSync(dir) || fs.readdirSync(dir).length === 0
}

function getArgv(cwd) {
  const argv = minimist(process.argv.slice(2), {
    alias: { 'file-path': ['path', 'p'] }
  })

  if (!argv.p) return { argv }
  return {
    argv,
    originFilePath: getFilePath(argv.path, cwd)
  }
}

async function init() {
  const cwd = process.cwd()

  let { argv, originFilePath } = getArgv(cwd)

  let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'images' : targetDir

  let result = {}

  try {
    result = await prompts([
      {
        name: 'filePath',
        type: originFilePath ? null : 'text',
        message: 'Parsed file path：',
        validate: (value) => isFileLegal(value)
      },
      {
        name: 'targetDirName',
        type: targetDir ? null : 'text',
        message: 'Target directory name：',
        initial: defaultProjectName,
        onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
      },
      {
        name: 'shouldOverwrite',
        type: () => (canSafelyOverwrite(targetDir) ? null : 'confirm'),
        message: () => {
          const dirForPrompt =
            targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`

          return `${dirForPrompt} is not empty. Remove existing files and continue?`
        }
      },
      {
        name: 'overwriteChecker',
        type: (prev, values = {}) => {
          if (values.shouldOverwrite === false) {
            throw new Error(red('✖') + ' Operation cancelled')
          }
          return null
        }
      }
    ])
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  const { filePath = originFilePath, targetDirName, shouldOverwrite } = result

  const root = path.resolve(cwd, targetDirName)

  const content = readFile(filePath)
  const images = parse(content)

  await createRootDir(root, shouldOverwrite)
  await downLoadImageToLocal(images, root)
}

init().catch((error) => {
  console.log(error)
})
