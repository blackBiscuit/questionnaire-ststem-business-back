import { Context, Next } from 'koa'
import { verify } from 'jsonwebtoken'
import { NO_NEED_TOKEN, TOKEN_SECRET } from '../const'
import { ErrorList } from '../const/code'
import { TokenUserInfo } from '../types/user'
const verifyUserTokenMiddleware = async (ctx: Context, next: Next) => {
  console.log(ctx.url)
  if (NO_NEED_TOKEN.find((rep) => rep.test(ctx.url))) return await next()
  if (ctx.header?.authorization) {
    const parts = ctx.header.authorization.split(' ')
    const scheme = parts[0]
    const token = parts[1]
    if (/^Bearer$/i.test(scheme)) {
      try {
        const user = verify(token, TOKEN_SECRET, {
          // complete: true
        })
        const { username, email, id } = user as TokenUserInfo
        ctx.append(
          'userInfo',
          encodeURI(
            JSON.stringify({
              id,
              username,
              email
            })
          )
        )
        //  ctx.append('userInfo', JSON.stringify(user))
      } catch (error) {
        console.log(error)
        ctx.status = 401
        ctx.error(ErrorList.TokenExpired.code, ErrorList.TokenExpired.msg)
        return
      }
    } else {
      ctx.status = 401
      ctx.error(ErrorList.MissingToken.code, ErrorList.MissingToken.msg)
      return
    }
  } else {
    return await next().catch((err) => {
      if (err.status === 401) {
        ctx.status = 401
        ctx.error(ErrorList.MissingToken.code, ErrorList.MissingToken.msg)
      } else {
        throw err
      }
      //   prohibitPassage(ctx, err, ErrorList.MissingToken)
    })
  }
  await next()
}
export default verifyUserTokenMiddleware
