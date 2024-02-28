import { Context, Next } from 'koa'
import Code from '../utils/code'
import { ErrorList } from '../const/code'
const verifyEmailCodeMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.request.body) {
    ctx.error(
      ErrorList.UserRegisterParams.code,
      ErrorList.UserRegisterParams.msg
    )
    return
  }
  // const { emailCode, email } = ctx.request.body
  // const verifyCode = await Code.getCode(email)
  // if (!verifyCode) {
  //   ctx.error(
  //     ErrorList.VerificationCodeExpired.code,
  //     ErrorList.VerificationCodeExpired.msg
  //   )
  //   return
  // }
  // if (verifyCode !== emailCode) {
  //   console.log(verifyCode !== emailCode)
  //   ctx.error(ErrorList.EmailCodeMismatch.code, ErrorList.EmailCodeMismatch.msg)
  //   return
  // }
  const { emailCode: _emailCode, ...remain } = ctx.request.body
  ctx.request.body = remain
  await next()
}
export default verifyEmailCodeMiddleware
