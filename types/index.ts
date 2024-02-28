import koa from 'koa'
declare module 'koa' {
  interface DefaultContext {
    success: <T extends any = any>(data?: T) => void
    error: (code: number, msg?: string) => void
  }
}
