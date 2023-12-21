import { Context, Next } from 'koa'
import { ErrorList } from '../const/code'
const emailReg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
const verifyEmailMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.request.body) {
    ctx.error(ErrorList.NullEmail.code, ErrorList.NullEmail.msg)
    return
  }
  const { email = '' } = ctx.request.body
  if (!emailReg.test(email)) {
  
     ctx.error(ErrorList.EmailParams.code, ErrorList.EmailParams.msg)
    return
  }
  await next()
}
export default verifyEmailMiddleware
