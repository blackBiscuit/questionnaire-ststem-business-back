import { Context, Next } from 'koa'
const responseMiddleware = async (ctx: Context, next: Next) => {
  ctx.success = <T extends any = any>(data?: T) => {
    const res: Record<string, any> = {
      errno: 0
    }
    if (data !== undefined) {
      res.data = data
    }
    ctx.body = res
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
