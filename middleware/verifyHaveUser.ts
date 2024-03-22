import { Context, Next } from 'koa'
import { ErrorList } from '../const/code'
import Code from '../utils/code'
import prisma from '../db/mysql'
const emailReg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
const verifyHaveUserMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.request.body) {
    ctx.error(ErrorList.NullEmail.code, ErrorList.NullEmail.msg)
    return
  }
  const { email = '' } = ctx.request.body
  const { isForget } = ctx.query
  if (!emailReg.test(email)) {
    ctx.error(ErrorList.EmailParams.code, ErrorList.EmailParams.msg)
    return
  }
  if (isForget) {
  const user = await  prisma.user.findUnique({
      where: {
        email
      }
    }) 
    if(!user) {
      ctx.error(ErrorList.NotUser.code, ErrorList.NotUser.msg)
      return
    } 
  }
  await next()
}
export default verifyHaveUserMiddleware
