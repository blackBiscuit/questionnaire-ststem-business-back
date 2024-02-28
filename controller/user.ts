import { Context } from 'koa'
import md5 from 'md5'
import RandomStr from 'randomstring'
import { sign } from 'jsonwebtoken'
import { registerService, loginService } from '../service/user'
import { RegisterUserInfo, LoginUser, UserInfo } from '../types/user'
import { ErrorList } from '../const/code'
import { TOKEN_SECRET } from '../const'
import { sendEmail } from '../utils/email'
import { getUserInfo } from '../utils/user'
export const registerController = async (ctx: Context) => {
  console.log(ctx.request.body)
  const user = ctx.request.body as RegisterUserInfo
  try {
    const u = await registerService({ ...user, password: md5(user.password) })
    if (!u) {
      ctx.error(
        ErrorList.AlreadyRegistered.code,
        ErrorList.AlreadyRegistered.msg
      )
      return
    }
    const { username, email } = u
    ctx.success({
      username,
      email
    })
  } catch (error) {}
}
export const loginController = async (ctx: Context) => {
  const userInfo = {
    ...ctx.request.body,
    password: md5(ctx.request.body.password)
  } as LoginUser
  const user = await loginService(userInfo)
  if (user) {
    const { email, username, id } = user
    const payload = {
      username,
      email,
      id
    }
    const token = sign(payload, TOKEN_SECRET, { expiresIn: '10h' })
    ctx.success({
      token,
      userInfo: {
        username,
        email
      }
    })
  } else {
    ctx.error(
      ErrorList.AccountPasswordNotMatch.code,
      ErrorList.AccountPasswordNotMatch.msg
    )
  }
}
export const userInfoController = async (ctx: Context) => {
  const { email, username } = getUserInfo(ctx)
  console.log()
  ctx.success({ username, email })
}
export const emailCodeController = async (ctx: Context) => {
  const { email } = ctx.request.body
  const codeStr = RandomStr.generate(6)
  sendEmail(email, codeStr)
  ctx.success({})
}
