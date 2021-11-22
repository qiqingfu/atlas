const matchImageReg = /https?:\/\/(?:\w+.)+\/(\w+)(.(?:jpe?g|svg|png))/gi

const exec = (content) => {
  const arrays = []
  let result
  while ((result = matchImageReg.exec(content)) !== null) {
    const [src, fileName, extname] = result
    arrays.push({ src, fileName, extname })
  }

  return arrays
}

export const parse = (content, nameType = 'number') => {
  const isCreateIndex = nameType === 'number'
  return exec(content)
    .map((array,index)
      => ({ ...array, fileName: isCreateIndex ? ++index : array.fileName }))
}
