import { Context, DefaultContext } from 'koa'
import koaRouter from 'koa-router'
import randomStr from 'randomstring'
import { sendEmail } from '../utils/email'
import { ErrorList } from '../const/code'
import verifyEmailMiddleware from '../middleware/verifyEmail'
import verifyPramsElement from '../middleware/verifyPramsElement'
import verifyEmailCodeMiddleware from '../middleware/verifyEmailCode'
import {
  registerController,
  loginController,
  userInfoController,
  emailCodeController
} from '../controller/user'

const router = new koaRouter<DefaultContext, Context>({
  prefix: '/api/user'
})
router.get('/info', userInfoController)
router.post('/register', verifyEmailCodeMiddleware, registerController)
router.post('/login', loginController)
//KLRSRUORFDSDFHDA

router.post('/email/code', verifyEmailMiddleware, emailCodeController)
router.post(
  '/test/:email',
  verifyPramsElement([
    {
      type: 'body',
      rules: [
        {
          required: true,
          warning: ErrorList.ParamsNull,
          paramsName: 'email'
        },
        {
          warning: ErrorList.EmailParams,
          paramsName: 'email',
          type: 'email'
        }
      ]
    },
    {
      type: 'params',
      rules: [
        {
          type: 'email',
          required: true,
          warning: {
            code: 11,
            msg: 'dkdkdk'
          },
          paramsName: 'email'
        }
      ]
    }
  ]),
  async (ctx) => {
    console.log(ctx.query.email)
    ctx.success(0)
  }
)
export default router
