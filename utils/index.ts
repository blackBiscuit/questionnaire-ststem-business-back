import Koa from 'koa'
import Mock from 'mockjs'
import path from 'path'
import fs from 'fs'
import { ulid } from 'ulid'
const Random = Mock.Random
export const getIpAddress = () => {
  const interfaces = require('os').networkInterfaces()
  for (const devName in interfaces) {
    const temp = interfaces[devName]

    for (let i = 0; i < temp.length; i++) {
      const alias = temp[i]

      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

export interface QuestionData {
  id: string
  title: string
  answerCount: number
  isStar: boolean
  isPublished: boolean
  createAt: string
  isDeleted: boolean
}
// 0 false 1 true
interface SearchOption {
  keyword: string
  isStar: number
  isDeleted: number
  page: number
  len: number
}
export const getQuestionData = (opt: Partial<SearchOption> = {}) => {
  const { len = 10, isDeleted, isStar } = opt
  const list: QuestionData[] = []
  for (let i = 0; i < len; i++) {
    list.push({
      id: ulid(),
      title: Random.ctitle(),
      answerCount: Random.natural(50, 100),
      isStar: isStar === 1 ? true : Random.boolean(),
      isPublished: Random.boolean(),
      createAt: Random.datetime(),
      isDeleted: isDeleted === 1 ? true : Random.boolean()
    })
  }
  return list
}
export const autoRouter = async (app: Koa) => {
  const dir = './router'
  const fileList = fs.readdirSync(dir)
  console.log(fileList)
  const filesToImport = fileList.filter((file) => {
    console.log(path.resolve(dir, file))
    return fs.statSync(path.resolve(dir, file)).isFile() && file !== 'index.ts'
  })
  if (filesToImport.length > 0) {
    filesToImport.forEach(async (file) => {
      const module = await import(path.resolve(dir, file))
      const route = module.default
      if (route && typeof route.routes === 'function') {
        app.use(route.routes())
      }
    })
  }
}
// const selectAry = [
//   0,
//   1,
//   2,
//   3,
//   4,
//   5,
//   6,
//   7,
//   8,
//   9,
//   'A',
//   'B',
//   'C',
//   'D',
//   'E',
//   'F',
//   'G',
//   'H',
//   'I',
//   'J',
//   'K',
//   'L',
//   'M',
//   'N',
//   'O',
//   'P',
//   'Q',
//   'R',
//   'S',
//   'T',
//   'U',
//   'V',
//   'W',
//   'X',
//   'Y',
//   'Z',
//   'a',
//   'b',
//   'c',
//   'd',
//   'e',
//   'f',
//   'g',
//   'h',
//   'i',
//   'j',
//   'k',
//   'l',
//   'm',
//   'n',
//   'o',
//   'p',
//   'q',
//   'r',
//   's',
//   't',
//   'u',
//   'v',
//   'w',
//   'x',
//   'y',
//   'z'
// ]
// export const getRandomCode = (min = 5, max?: number) => {
//   const len = max ? random.int(min, max) : min
//   let code = ''
//   for (let i = 0; i < len; i++) {
//     const index = random.int(0, selectAry.length)
//     code += selectAry[index]
//   }
//   return code
// }
