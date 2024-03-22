import { Context } from 'koa'
import { getUserInfo } from '../utils/user'
import { getAnswerDataListServices } from '../service/stat'
import { ErrorList } from '../const/code'
import {
  AnswerProps,
  getAnswerDataList,
  getAnswerDataListCount,
  getAnswerDataListKeys
} from '../utils'
import { QuestionComponent } from '../types/question'
import { DEFAULT_STAT_PAGE, DEFAULT_STAT_PAGE_SIZE } from '../const'
const formatAnswerList = (list: Record<string, string | number | string[]>[]) =>
  list.map((item) => {
    Object.keys(item).forEach((key) => {
      const data = item[key]
      if (Array.isArray(data)) {
        // [ 'option2', '01HPEMZQ437JJM5J5EJF8ZJWE5' ]
        item[key] = data.join(',')
      }
    })
    return item
  })

export const getAnswerDataListController = async (ctx: Context) => {
  const { questionId } = ctx.params
  if (!questionId) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const userInfo = getUserInfo(ctx)
  const page = Number(ctx.query.page) || DEFAULT_STAT_PAGE
  const pageSize = Number(ctx.query.pageSize) || DEFAULT_STAT_PAGE_SIZE
  const answerDataList = await getAnswerDataListServices(
    +questionId,
    userInfo,
    page,
    pageSize
  )
  if (!answerDataList) {
    ctx.success({
      total: 0,
      list: null
    })
    return
  }
  const { total, list } = answerDataList
  // const total = 100
  const listFormat = list.map((item) => {
    Object.keys(item).forEach((key) => {
      const data = item[key]
      if (Array.isArray(data)) {
        // [ 'option2', '01HPEMZQ437JJM5J5EJF8ZJWE5' ]
        item[key] = data.join(',')
      }
    })
    return item
  })
  ctx.success({
    total,
    list: listFormat
  })
}
export const getAnswerDataListCountController = async (ctx: Context) => {
  const { componentId, questionId } = ctx.params
  if (!questionId || !componentId) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const userInfo = getUserInfo(ctx)
  const answerDataList = await getAnswerDataListServices(
    +questionId,
    userInfo,
   
  )
  if (!answerDataList) {
    ctx.success({
      stat: []
    })
    return
  }
  const { total, list } = answerDataList
  if (!answerDataList.componentList) {
    ctx.success({
      stat: []
    })
    return
  }
  const componentList = JSON.parse(
    answerDataList.componentList as string
  ) as QuestionComponent[]
  const listFormat = formatAnswerList(list)
  console.log(
    81,
    getAnswerDataListKeys(componentId, componentList, listFormat as any)
  )
  const stat = getAnswerDataListCount(
    componentId,
    componentList,
    listFormat as any
  )
  ctx.success({
    stat
  })
}
// export const getAnswerDataListKeysController = async (ctx: Context) => {
//   const { componentId, questionId } = ctx.params
//   if (!questionId || !componentId) {
//     ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
//     return
//   }
//   const userInfo = getUserInfo(ctx)
//   const answerDataList = await getAnswerDataListServices(+questionId, userInfo)
//   if (!answerDataList) {
//     ctx.success({
//       keys: []
//     })
//     return
//   }
//   const { total, list } = answerDataList
//   if (!answerDataList.componentList) {
//     ctx.success({
//       keys: []
//     })
//     return
//   }
//   const componentList = JSON.parse(
//     answerDataList.componentList as string
//   ) as QuestionComponent[]
//   const listFormat = formatAnswerList(list)
//   //getAnswerDataListKeys
// }
