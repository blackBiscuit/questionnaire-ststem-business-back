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
  const countWhere = {
    authorId: id,
    isDeleted,
    isStar,
    title: {
      contains: keyword
    }
  }
  const total = await prisma.question.count({
    where: countWhere
  })
  // console.log(total)
  const questionList = await prisma.question.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: countWhere,
    orderBy: [
      {
        createAt: 'desc'
      }
    ]
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
  const { title, desc, componentList, authorId } = duplicateQuestion
  const newQuestion = await prisma.question.create({
    data: {
      ...DEFAULT_QUESTION,
      authorId,
      title,
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
  userInfo: TokenUserInfo,
  time: {
    startTime: Date | null
    endTime: Date | null
  }
) => {
  const { id } = userInfo
  const { startTime, endTime } = time
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
        publishComponentList: componentList,
        startTime,
        endTime
      }
    : { isPublished: published, answerCount: count, publishComponentList: [] }
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
export const questionTemplateService = async () => {
  const templateKinds = await prisma.questionTemplate.findMany({
    distinct: ['kind']
  })
  return templateKinds
}
export const questionGroupService = async (type?: number) => {
  const templateGroups = await prisma.questionGroup.findMany({
    where: {
      templateId: type
    },
    select: {
      id: true,
      title: true,
      desc: true
    }
  })
  console.log(237, templateGroups)
  return templateGroups
}
export const questionGroupItemService = async (id: number) => {
  const groupItem = await prisma.questionGroup.findUnique({
    where: {
      id
    },
    select: {
      title: true,
      desc: true,
      list: {
        select: {
          id: true,
          title: true,
          createAt: true
        }
      }
    }
  })
  return groupItem
}
export const questionTemplateItemService = async (id: number) => {
  const templateQuestion = await prisma.questionList.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      title: true,
      desc: true,
      componentList: true,
      createAt: true,
      groupId: true,
      group: {
        select: {
          title: true
        }
      }
    }
  })
  return templateQuestion
}
export const duplicateQuestionTemplateItemService = async (
  duplicateId: number,
  userInfo: TokenUserInfo
) => {
  const duplicateQuestion = await prisma.questionList.findUnique({
    where: {
      id: duplicateId
    },
    select: {
      title: true,
      desc: true,
      componentList: true
    }
  })
  if (!duplicateQuestion) return null
  const { title, desc, componentList } = duplicateQuestion
  const { id: authorId } = userInfo
  const newQuestion = await prisma.question.create({
    data: {
      ...DEFAULT_QUESTION,
      authorId,
      title,
      desc,
      componentList: componentList!
    }
  })
  return newQuestion
}
