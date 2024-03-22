import prisma from '../db/mysql'
import { TokenUserInfo } from '../types/user'
export const getAnswerDataListServices = async (
  questionId: number,
  userInfo: TokenUserInfo,
  page?: number,
  pageSize?: number
) => {
  const { id } = userInfo
  const questionAnswer = await prisma.questionAnswer.findMany({
    skip: page && pageSize ? (page - 1) * pageSize : undefined,
    take: pageSize,
    select: {
      answer: true,
      id: true
    },
    where: {
      questionId,
      authorId: id
    },
    orderBy: [
      {
        id: 'desc'
      }
    ]
  })
  // console.log(15, questionAnswer)
  const questionObj = await prisma.question.findUnique({
    select: {
      componentList: true,
      _count: {
        select: {
          QuestionAnswer: true
        }
      }
    },
    where: {
      authorId: id,
      id: questionId
    }
  })
  if (!questionAnswer && !questionObj) {
    return null
  }
  //console.log(questionAnswer)
  const list = questionAnswer.map<Record<string, string | string[] | number>>(
    (item) => ({
      id: item.id,
      ...JSON.parse(item.answer as string)
    })
  )
  console.log(list, questionObj?.componentList)
  return {
    total: questionObj?._count.QuestionAnswer || 0,
    list,
    componentList: questionObj?.componentList
  }
  // return (q && questionObj) ? q.QuestionAnswer : null
}
