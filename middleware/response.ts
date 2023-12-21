import { Context, Next } from 'koa'
const responseMiddleware = async (ctx: Context, next: Next) => {
  ctx.success = (data: any) => {
    ctx.body = {
      errno: 0,
      data
    }
  }
  ctx.error = (code: number, msg?: string) => {
    ctx.body = {
      errno: code,
      msg
    }
  }
  await next()
}
export default responseMiddleware
