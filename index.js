#!/usr/bin/env node
// @ts-check

const minimist = require('minimist')
const { getPath } = require('./utils/getPath')
const { readFile } = require('./utils/readFile')
const { parse } = require('./utils/parse')

async function init () {
  const cwd = process.cwd()

  const argv = minimist(process.argv.slice(2), {
    alias: { 'file-path': ['path', 'p'] }
  })

  // 1. 获取文件的路径
  const originFilePath = getPath(argv.path, cwd)
  // 2. 读取路径文件的内容
  const content = readFile(originFilePath)
  // 3. 解析内容的 https 图片地址
  const images = parse(content)
  // 4. 下载对应的图片
  console.log(images)
}

init().catch(error => {
  console.log(error)
})
