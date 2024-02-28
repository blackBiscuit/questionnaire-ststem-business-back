import koaRouter from 'koa-router'
import { Context, DefaultContext } from 'koa'
import { getAnswerDataList, getAnswerDataListCount } from '../utils'
import { getAnswerDataListController, getAnswerDataListCountController } from '../controller/stat'
const router = new koaRouter<DefaultContext, Context>({
  prefix: '/api/stat'
})
interface AnswerProps {
  [key: string]: string
  id: string
}
interface StatQuestion {
  total: number
  list: AnswerProps[]
}
router.get('/:questionId', getAnswerDataListController)
router.get('/:questionId/:componentId', getAnswerDataListCountController)
export default router
