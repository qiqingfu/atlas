#!/usr/bin/env node
// @ts-check

const path = require('path')
const fs = require('fs')

const minimist = require('minimist')
const prompts = require('prompts')

const { red } = require('kolorist')
const { getPath } = require('./utils/getPath')
const { readFile } = require('./utils/readFile')
const { parse } = require('./utils/parse')
const { downLoadImageToLocal, createRootDir } = require('./utils/generate')

function canSafelyOverwrite(dir) {
  return !fs.existsSync(dir) || fs.readdirSync(dir).length === 0
}

async function init() {
  const cwd = process.cwd()

  const argv = minimist(process.argv.slice(2), {
    alias: { 'file-path': ['path', 'p'] }
  })

  let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'images' : targetDir

 let result = {}

  try {
    result = await prompts([
      {
        name: 'targetDirName',
        type: targetDir ? null : 'text',
        message: 'Target directory name：',
        initial: defaultProjectName,
        onState: state => (targetDir = String(state.value).trim() || defaultProjectName)
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
  } catch(cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  const {
    targetDirName,
    shouldOverwrite
  } = result

  const root = path.resolve(cwd, targetDirName)

  // 1. 获取内容文件的路径
  const originFilePath = getPath(argv.path, cwd)
  // 2. 读取文件内容
  const content = readFile(originFilePath)
  // 3. 解析内容
  const images = parse(content)
  // 4. 覆盖或新增 root 目录
  await createRootDir(root, shouldOverwrite)
  // 5. 生成对应的图片
  await downLoadImageToLocal(images, root)
}

init().catch(error => {
  console.log(error)
})
