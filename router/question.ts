import koaRouter from 'koa-router'
import { Context, DefaultContext } from 'koa'
import { ulid } from 'ulid'
import { QuestionData } from '../utils'
import {
  createQuestionController,
  deleteQuestionsController,
  duplicateQuestionController,
  getQuestionController,
  getQuestionListController,
  publishQuestionController,
  publishedQuestionChangedController,
  updateQuestionController,
  updateQuestionsController
} from '../controller/question'

const router = new koaRouter<DefaultContext, Context>({
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
router.get('/question', getQuestionListController)
// 获取单条问卷详细信息
router.get('/question/:id', getQuestionController)
// 创建新问卷
router.post('/question', createQuestionController)
//更新单条数据
router.patch('/question/update/:id', updateQuestionController)
// 更新多条数据
router.patch('/questions/update', updateQuestionsController)
// 复制问卷
router.post('/question/duplicate/:id', duplicateQuestionController)
// 删除问卷
router.delete('/question', deleteQuestionsController)
// 问卷发布状态
router.patch('/question/published/:id', publishQuestionController)
router.get(
  '/question/published/changed/:id',
  publishedQuestionChangedController
)
export default router
