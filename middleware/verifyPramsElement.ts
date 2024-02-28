import { Context, Next } from 'koa'
import { ErrorList } from '../const/code'
type ParamsType = 'params' | 'body' | 'query'
interface WarningProps {
  code: number
  msg: string
}
export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  // | 'method'
  // | 'regexp'
  // | 'integer'
  // | 'float'
  | 'object'
  // | 'enum'
  // | 'date'
  // | 'url'
  // | 'hex'
  | 'email'
// {username: '' , password: ''}
interface RuleProps {
  required?: boolean
  type?: RuleType
  paramsName: string
  warning?: WarningProps
}
interface Props {
  type: ParamsType
  rules: RuleProps[]
}
const emailReg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
const typeMethods: Record<RuleType, (val: any) => boolean> = {
  string: (v) => typeof v === 'string',
  number: (v) => typeof v === 'number',
  boolean: (v) => typeof v === 'boolean',
  object: (v) => Object.prototype.toString.call(v) === '[object Object]',
  email: (v) => emailReg.test(v)
}
interface FlagObjProps {
  flag: boolean
  code: number
  msg: string
}
const getFlagObj = (flag: boolean, w: WarningProps): FlagObjProps =>
  flag
    ? {
        flag: false,
        code: w.code,
        msg: w.msg
      }
    : { flag: true, code: 0, msg: '' }

const verifyPramsElement = (data: Props[] | Props) => {
  const dataAry = Array.isArray(data) ? data : [data]
  return async (ctx: Context, next: Next) => {
    let flagObj = {
      flag: true,
      code: 0,
      msg: ''
    }
    const paramsData = {
      query: ctx.query,
      params: ctx.params,
      body: ctx.request.body
    }
    for (let j = 0; j < dataAry.length; j++) {
      const data = dataAry[j]
      for (let i = 0; i < data.rules.length; i++) {
        const item = data.rules[i]
        const requestParams = paramsData[data.type]
        const type = item.type || 'string'
        const currentP = requestParams[item.paramsName]
        const w: WarningProps = item.warning || ErrorList.ParamsNull
        // if(!item.required && currentP) {
        //   continue
        // }
        const flagObjAry = [
          getFlagObj((item.required && !currentP)!, w),
          getFlagObj(!typeMethods[type](currentP), w)
        ]
        flagObj = flagObjAry.find((item) => !item.flag) || {
          flag: true,
          code: 0,
          msg: ''
        }
        if (!flagObj.flag) {
          break
        }
        // if (item.required && !currentP) {
        //   const w: WarningProps = item.warning || ErrorList.ParamsNull
        //   flagObj.flag = false
        //   flagObj.code = w.code
        //   flagObj.msg = w.msg
        //   break
        // }
        // if (!typeMethods[item.type](currentP)) {
        // }
      }
      if (!flagObj.flag) {
        ctx.error(flagObj.code, flagObj.msg)
        return
      }
    }

    await next()
    // if (data.type === 'query') {
    //   for (let i = 0; i < data.rules.length; i++) {
    //     const item = data.rules[i]
    //     const currentP = ctx.query[item.paramsName]
    //     if (item.required && !currentP) {
    //       const w: WarningProps = item.warning?.required || ErrorList.ParamsNull
    //       ctx.error(w.code, w.msg)
    //       return
    //     }
    //   }
    // }
    // if (data.type === 'params') {
    // }
    // if (data.type === 'body') {
    // }
  }
}
export default verifyPramsElement
