import { Context, Next } from 'koa'
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
  publishedQuestionChangedService,
  questionTemplateService,
  questionGroupService,
  questionGroupItemService,
  questionTemplateItemService,
  duplicateQuestionTemplateItemService
} from '../service/question'
import { ErrorList } from '../const/code'
import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from '../const'
import { QuestionOpt, UpdateQuestionsOpt } from '../types/question'
const formatTime = (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
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
export const getQuestionController = async (ctx: Context, next: Next) => {
  const userInfo = getUserInfo(ctx)
  const id = Number(ctx.params.id as string)
  if (isNaN(id)) {
    ctx.success(null)
    return next()
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
      createAt: formatTime(question.createAt)
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
  const { title, componentList, desc, isDeleted, isPublished, isStar } =
    opt as QuestionOpt

  const question = await updateQuestionService(
    Number(id),
    {
      title,
      componentList: componentList ? JSON.stringify(componentList) : undefined,
      desc,
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
    const { id, title, componentList, desc, isDeleted, isPublished, isStar } =
      question
    return {
      id,
      title,
      componentList: componentList ? JSON.stringify(componentList) : undefined,
      desc,
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
  const { published, startTime, endTime } = ctx.request.body
  const { id } = ctx.params
  console.log(ctx.request.body, id)
  //Object.prototype.toString.call
  console.log(startTime, endTime)
  const getTime = (time: unknown) => {
    if (!time) return null
    const d = dayjs(time as string)
    return d.isValid() ? d.toDate() : null
  }
  if (typeof published !== 'boolean' || !id) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const userInfo = getUserInfo(ctx)
  const question = await publishQuestionService(+id, published, userInfo, {
    startTime: getTime(startTime),
    endTime: getTime(endTime)
  })
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
export const questionTemplateController = async (ctx: Context) => {
  const templateKinds = await questionTemplateService()
  ctx.success(templateKinds)
}
export const questionGroupController = async (ctx: Context) => {
  const { type } = ctx.query
  const templateKinds = await questionTemplateService()
  const currentKind = templateKinds.find((kind) => kind.id === Number(type))
  const templateGroups = await questionGroupService(
    currentKind ? currentKind.id : undefined
  )
  ctx.success(templateGroups)
}
export const questionGroupItemController = async (ctx: Context) => {
  if (!ctx.params.id) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const id = Number(ctx.params.id as string)
  if (isNaN(id)) {
    ctx.success(null)
    return
  }
  const groupItem = await questionGroupItemService(id)
  //dayjs(question.createAt).format('YYYY-MM-DD HH:mm:ss')
  const data = {
    ...groupItem,
    list: groupItem?.list.map((item) => ({
      ...item,
      createAt: formatTime(item.createAt)
    }))
  }
  ctx.success(data)
}
export const questionTemplateItemController = async (ctx: Context) => {
  if (!ctx.params.id) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const id = Number(ctx.params.id as string)
  if (isNaN(id)) {
    ctx.success(null)
    return
  }
  const templateQuestion = await questionTemplateItemService(id)
  if (templateQuestion) {
    try {
      const list = JSON.parse(templateQuestion.componentList as string)
      ctx.success({
        ...templateQuestion,
        componentList: list,
        createAt: formatTime(templateQuestion.createAt)
      })
      return
    } catch (error) {
      ctx.success(null)
    }
  }

  ctx.success(templateQuestion)
}
export const duplicateQuestionTemplateItemController = async (ctx: Context) => {
  if (!ctx.params.id) {
    ctx.error(ErrorList.ParamsNull.code, ErrorList.ParamsNull.msg)
    return
  }
  const id = Number(ctx.params.id as string)
  if (isNaN(id)) {
    ctx.error(ErrorList.DuplicateErr.code, ErrorList.DuplicateErr.msg)
    return
  }
  const userInfo = getUserInfo(ctx)
  const newQuestion = await duplicateQuestionTemplateItemService(+id, userInfo)
  if (newQuestion) {
    ctx.success({
      id: newQuestion.id
    })
  } else {
    ctx.error(ErrorList.DuplicateErr.code, ErrorList.DuplicateErr.msg)
  }
}
