// import { JsonValue } from '@prisma/client/runtime/library'
import prisma from '../db/mysql'
import { TokenUserInfo } from '../types/user'
import { DEFAULT_QUESTION } from '../const'
import { QuestionServiceOpt, UpdateQuestionsOpt } from '../types/question'
interface SearchOption {
  keyword?: string
  isStar?: boolean
  isDeleted: boolean
  page: number
  pageSize: number
}

export const createQuestionService = async (userInfo: TokenUserInfo) => {
  const { id } = userInfo
  const newQuestion = await prisma.question.create({
    data: { ...DEFAULT_QUESTION, authorId: id }
  })
  return newQuestion
}
export const getQuestionService = async (
  questionId: number,
  userInfo: TokenUserInfo
) => {
  const { id } = userInfo
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
      authorId: id
    }
  })
  return question
}
export const getQuestionListService = async (
  opt: SearchOption,
  userInfo: TokenUserInfo
) => {
  const { id } = userInfo
  const { isDeleted, isStar, keyword, page, pageSize } = opt
  console.log(isDeleted)
  const countWhere: {
    authorId: number
    isDeleted: boolean
    isStar?: boolean
    keyword?: string
  } = {
    authorId: id,
    isDeleted,
    isStar
  }
  if (keyword) {
    countWhere.keyword = keyword
  }
  const total = await prisma.question.count({
    where: countWhere
  })
  // console.log(total)
  const questionList = await prisma.question.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: countWhere
  })
  console.log(questionList)
  return {
    list: questionList,
    total
  }
  // const count = await prisma.user.findMany({
  //   select: {
  //     questions: {
  //       where: {
  //         authorId: id,
  //         isStar: true
  //       }
  //     }
  //   }
  // })
  // const q = await prisma.question.findMany({
  //   where: {
  //     authorId: id
  //   }
  // })
  // console.log(q)
  //const questionList =await prisma.question
}
export const duplicateQuestionService = async (
  duplicateId: number,
  userInfo: TokenUserInfo
) => {
  const { id } = userInfo
  const duplicateQuestion = await prisma.question.findUnique({
    where: {
      id: duplicateId,
      authorId: id
    }
  })
  if (!duplicateQuestion) return
  const { title, css, js, desc, componentList, authorId } = duplicateQuestion
  const newQuestion = await prisma.question.create({
    data: {
      ...DEFAULT_QUESTION,
      authorId,
      title,
      css,
      js,
      desc,
      componentList: componentList!
    }
  })
  return newQuestion
}
export const updateQuestionService = async (
  questionId: number,
  opt: QuestionServiceOpt,
  userInfo: TokenUserInfo
) => {
  const { id } = userInfo
  const question = await prisma.question.update({
    where: {
      authorId: id,
      id: questionId
    },
    data: opt
  })
  return question
}
export const updateQuestionsService = async (
  opts: Array<
    Omit<UpdateQuestionsOpt, 'componentList'> & {
      componentList?: string
    }
  >,
  userInfo: TokenUserInfo
) => {
  const questions = opts.map(async (opt) => {
    const { id: questionId, ...remain } = opt
    return await updateQuestionService(questionId, remain, userInfo)
  })
  return Promise.all(questions)
}
export const deleteQuestionsService = async (
  ids: Array<number>,
  userInfo: TokenUserInfo
) => {
  const { id } = userInfo
  const questions = ids.map(async (questionId) => {
    try {
      const question = await prisma.question.delete({
        where: {
          authorId: id,
          id: questionId
        }
      })
      return question.id
    } catch (error) {
      return null
    }
  })
  return Promise.all(questions)
}
export const publishQuestionService = async (
  questionId: number,
  published: boolean,
  userInfo: TokenUserInfo
) => {
  const { id } = userInfo
  const question = await prisma.question.findUnique({
    where: { authorId: id, id: questionId }
  })
  if (!question) return null
  const { answerCount, componentList, publishComponentList } = question
  //重新发布
  if (answerCount > 0 && published) {
    //对比前后问卷
    console.log('---175', componentList !== publishComponentList)
    //不相同清除答卷
    if (publishComponentList !== componentList) {
      await prisma.questionAnswer.deleteMany({
        where: {
          questionId
        }
      })
    }
  }
  const count = await prisma.questionAnswer.count({
    where: {
      questionId
    }
  })
  if (!componentList) return null
  const data = published
    ? {
        isPublished: published,
        answerCount: count,
        publishComponentList: componentList
      }
    : { isPublished: published, answerCount: count }
  //发布状态,把新问卷给published问卷
  const newQuestion = await prisma.question.update({
    where: {
      id: questionId,
      authorId: id
    },
    data
  })
  return newQuestion
}
export const publishedQuestionChangedService = async (
  questionId: number,
  userInfo: TokenUserInfo
) => {
  const { id } = userInfo
  const question = await prisma.question.findUnique({
    where: { authorId: id, id: questionId }
  })
  if (!question) return null
  const { componentList, publishComponentList } = question
  return publishComponentList !== componentList
}
