import { Context, DefaultContext } from 'koa'
import koaRouter from 'koa-router'
import Mock from 'mockjs'
import randomStr from 'randomstring'
import { sendEmail } from '../utils/email'
import { ErrorList } from '../const/code'
import verifyEmailMiddleware from '../middleware/verifyEmail'
import verifyEmailCodeMiddleware from '../middleware/verifyEmailCode'
const Random = Mock.Random
const router = new koaRouter<DefaultContext, Context>({
  prefix: '/api/user'
})
router.get('/info', async (ctx) => {
  ctx.body = {
    errno: 0,
    data: {
      username: Random.cname(),
      email: Random.email()
    }
  }
})
router.post('/register', verifyEmailCodeMiddleware, async (ctx) => {
  console.log(ctx.request.body)
  ctx.body = {
    errno: 0
  }
})
router.post('/login', async (ctx) => {
  ctx.body = {
    errno: 0,
    data: {
      token: Random.word(20)
    }
  }
})
//KLRSRUORFDSDFHDA

router.post('/email/code', verifyEmailMiddleware, async (ctx) => {
  const { email } = ctx.request.body
  console.log('email', email)
  const codeStr = randomStr.generate(6)
  sendEmail(email, codeStr)
  ctx.success({})
})
export default router
