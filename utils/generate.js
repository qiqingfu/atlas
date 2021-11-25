const fs = require('fs')
const path = require('path')
const request = require('request')
const { green, gray } = require('kolorist')
const ora = require('ora').default
const { postOrderDirectoryTraverse } = require('./directoryTraverse')

const join = (name, ext) => name + '.' + ext
const logMsg = (succeed = 0, progress = 0) => `succeed: ${succeed}, progress: ${progress}`

const emptyDir = (root) => {
  postOrderDirectoryTraverse(
    root,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file)
  )
}

export const downLoadImageToLocal = (data, targetDir) => {
  console.log('Ready to download...')

  let index = 0
  let speed
  let speedLogMessage
  let total = data.length

  const spinner = ora({ text: logMsg() }).start()
  spinner.color = 'yellow'

  data.forEach(({ src, fileName, extname }) => {
    const writable = fs.createWriteStream(path.resolve(targetDir, join(fileName, extname)))
    writable.on('finish', () => {
      index++
      speed = Math.floor((index / total) * 100) + '%'
      spinner.text = speedLogMessage = logMsg(index, speed)

      if (index === total) {
        spinner.succeed(green(speedLogMessage))
        console.log(gray(`The generated directory is ${targetDir}`))
        console.log()
      }
    })
    request(src).pipe(writable)
  })
}

export const createRootDir = (root, shouldOverwrite) => {
  if (shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }
}
