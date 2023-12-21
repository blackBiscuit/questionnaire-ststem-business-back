import koa from 'koa'
declare module 'koa' {
  interface DefaultContext {
    success: (data: any) => void
    error: (code: number, msg?: string) => void
  }
}
