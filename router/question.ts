import koaRouter from 'koa-router'
import { Context } from 'koa'
import { ulid } from 'ulid'
import { getQuestionData, QuestionData } from '../utils'
import { DEFAULT_LIST_PAGE_SIZE, DEFAULT_LIST_PAGE } from '../const'
const router = new koaRouter({
  prefix: '/api'
})
/** 
 * 
 * 0 false 1 true
interface SearchOption {
  keyword: string
  isStar: number // 0 | 1
  isDeleted: number // 0 | 1
  page: number
  pageSize: number
}
*/
// 获取问卷列表
router.get('/question', async (ctx) => {
  const { isDeleted = 0, isStar = 0 } = ctx.query

  const page = Number(ctx.query.page) || DEFAULT_LIST_PAGE
  const pageSize = Number(ctx.query.pageSize) || DEFAULT_LIST_PAGE_SIZE
  ctx.body = {
    errno: 0,
    data: {
      list: getQuestionData({
        isDeleted: +isDeleted,
        isStar: +isStar,
        len: pageSize
      }),
      total: 100
    }
  }
})
// 获取单条问卷详细信息
router.get('/question/:id', async (ctx) => {
  ctx.body = {
    errno: 0,
    data: {
      id: ctx.params.id || '',
      title: '看看罚款'
    }
  }
})
// 创建新问卷
router.post('/question', async (ctx) => {
  ctx.body = {
    errno: 0,
    data: {
      id: ulid()
    }
  }
})
//更新单条数据
router.patch('/question/update/:id', async (ctx) => {
  const { id } = ctx.params
  console.log(id)
  ctx.body = {
    errno: 0
  }
})
// 更新多条数据
router.patch('/questions/update', async (ctx) => {
  const questions = ctx.request.body.list as Array<Partial<QuestionData>>
  console.log(questions)
  ctx.body = {
    errno: 0,
    data: {
      list: questions.map((q) => q.id)
    }
  }
})
// 复制问卷
router.post('/question/duplicate/:id', async (ctx) => {
  const { id } = ctx.params
  console.log(id)
  ctx.body = {
    errno: 0,
    data: {
      id: ulid()
    }
  }
})
// 删除问卷
router.delete('/question', async (ctx) => {
  if (Array.isArray(ctx.request.body.ids)) {
    const ids = ctx.request.body.ids as unknown[]
    console.log(ids)
    ctx.body = {
      errno: 0
    }
    return
  }

  ctx.body = {
    errno: 424,
    msg: '参数错误'
  }
})

export default router
