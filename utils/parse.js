const matchImageReg = /https?:\/\/.+\/(.+)\.(jpe?g|png|svg)/gi
const gen = (src, fileName, type, i) => ({src, fileName: type === 'number' ? i : fileName })

const exec = (content) => {
  const arrays = []
  let result
  while ((result = matchImageReg.exec(content)) !== null) {
    const [src, fileName] = result
    arrays.push({ src, fileName })
  }

  return arrays
}

export const parse = (content, nameType = 'number') => {
  // 1. 通过正则匹配出整个 https://xxx URL 地址和名称
  const execResult = exec(content)
  // 2. 生成指定的内容格式
  return execResult.map(({src, fileName}, i) => gen(src, fileName, nameType, i + 1))
}
