import { Context } from 'koa'
import dayjs from 'dayjs'
import { getUserInfo } from '../utils/user'
import {
  createQuestionService,
  getQuestionService,
  getQuestionListService,
  duplicateQuestionService,
  updateQuestionService,
  updateQuestionsService,
  deleteQuestionsService,
  publishQuestionService,
  publishedQuestionChangedService
} from '../service/question'
import { ErrorList } from '../const/code'
import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from '../const'
import { QuestionOpt, UpdateQuestionsOpt } from '../types/question'

export const createQuestionController = async (ctx: Context) => {
  const userInfo = getUserInfo(ctx)
  const question = await createQuestionService(userInfo)
  console.log(question)
  if (question) {
    ctx.success({
      id: question.id
    })
  }
}
export const getQuestionController = async (ctx: Context) => {
  const userInfo = getUserInfo(ctx)
  const id = Number(ctx.params.id as string)
  if (isNaN(id)) {
    ctx.success(null)
    return
  }
  const question = await getQuestionService(id, userInfo)
  if (question?.componentList) {
    question.componentList = JSON.parse(question.componentList as string)
  }
  ctx.success(question)
}
export const getQuestionListController = async (ctx: Context) => {
  const userInfo = getUserInfo(ctx)
  const deleteNum = Number(ctx.query.isDeleted)
  const starNum = Number(ctx.query.isStar)
  const page = Number(ctx.query.page) || DEFAULT_LIST_PAGE
  const pageSize = Number(ctx.query.pageSize) || DEFAULT_LIST_PAGE_SIZE
  const isDeleted = !!([0, 1].includes(deleteNum) ? deleteNum : 0)
  const isStar = starNum === 1 ? true : undefined
  const keyword = typeof ctx.query.keyword === 'string' ? ctx.query.keyword : ''
  const { list, total } = await getQuestionListService(
    {
      keyword,
      page,
      pageSize,
      isDeleted,
      isStar
    },
    userInfo
  )
  ctx.success({
    total,
    list: list.map((question) => ({
      ...question,
      createAt: dayjs(question.createAt).format('YYYY-MM-DD HH:mm:ss')
    }))
  })
}
export const duplicateQuestionController = async (ctx: Context) => {
  const { id } = ctx.params
  const userInfo = getUserInfo(ctx)
  const newQuestion = await duplicateQuestionService(+id, userInfo)
  if (newQuestion) {
    ctx.success({
      id: newQuestion.id
    })
  } else {
    ctx.error(ErrorList.DuplicateErr.code, ErrorList.DuplicateErr.msg)
  }
}
export const updateQuestionController = async (ctx: Context) => {
  const { id } = ctx.params
  const opt = ctx.request.body
  if (!opt || !id) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const userInfo = getUserInfo(ctx)
  const {
    title,
    componentList,
    desc,
    js,
    css,
    isDeleted,
    isPublished,
    isStar
  } = opt as QuestionOpt

  const question = await updateQuestionService(
    Number(id),
    {
      title,
      componentList: componentList ? JSON.stringify(componentList) : undefined,
      desc,
      js,
      css,
      isDeleted,
      isPublished,
      isStar
    },
    userInfo
  )
  if (!question) {
    ctx.error(ErrorList.UpdateErr.code, ErrorList.UpdateErr.msg)
    return
  }

  ctx.success()
}
export const updateQuestionsController = async (ctx: Context) => {
  const { list } = ctx.request.body
  //
  if (!list) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const userInfo = getUserInfo(ctx)
  const opts = (list as Array<UpdateQuestionsOpt>).map((question) => {
    const {
      id,
      title,
      componentList,
      desc,
      js,
      css,
      isDeleted,
      isPublished,
      isStar
    } = question
    return {
      id,
      title,
      componentList: componentList ? JSON.stringify(componentList) : undefined,
      desc,
      js,
      css,
      isDeleted,
      isPublished,
      isStar
    }
  })
  const questions = await updateQuestionsService(opts, userInfo)
  if (questions.find((q) => q === null)) {
    ctx.error(ErrorList.UpdateErr.code, ErrorList.UpdateErr.msg)
    return
  }

  ctx.success()
}
export const deleteQuestionsController = async (ctx: Context) => {
  if (!Array.isArray(ctx.request.body?.ids)) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const ids = (ctx.request.body.ids as any[]).map((id) => Number(id))
  const userInfo = getUserInfo(ctx)
  const questions = (await deleteQuestionsService(ids, userInfo)).filter(
    (id) => id != null
  )
  ctx.success(questions)
}
export const publishQuestionController = async (ctx: Context) => {
  const { published } = ctx.request.body
  const { id } = ctx.params
  console.log(ctx.request.body, id)
  if (typeof published !== 'boolean' || !id) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const userInfo = getUserInfo(ctx)
  const question = await publishQuestionService(+id, published, userInfo)
  if (!question) {
    ctx.error(
      ErrorList.PublishedStatusErr.code,
      ErrorList.PublishedStatusErr.msg
    )
    return
  }
  ctx.success()
}
export const publishedQuestionChangedController = async (ctx: Context) => {
  const { id } = ctx.params
  if (!id) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const userInfo = getUserInfo(ctx)
  const isChanged = await publishedQuestionChangedService(+id, userInfo)
  if (typeof isChanged !== 'boolean') {
    ctx.error(
      ErrorList.PublishedStatusErr.code,
      ErrorList.PublishedStatusErr.msg
    )
    return
  }
  ctx.success({
    isChanged
  })
}
