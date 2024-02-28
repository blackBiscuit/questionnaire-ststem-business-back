import { Context } from 'koa'
import { TokenUserInfo } from '../types/user'
export const getUserInfo = (ctx: Context) => {
  const userInfo: TokenUserInfo = JSON.parse(decodeURI(ctx.response.get('userInfo')))
  return userInfo
}
