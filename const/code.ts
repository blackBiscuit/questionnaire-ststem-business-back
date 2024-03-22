export enum ParamsError {
  EmailParams = 10001,
  NullEmail = 10002
}
const paramsErrorcode = {
  10001: '邮箱格式不正确',
  10002: '邮箱为空'
}
export class ErrorList {
  static readonly ParamsNull = {
    code: 10000,
    msg: '关键参数为空，请核对后重试'
  }
  static readonly EmailParams = {
    code: 10001,
    msg: '邮箱格式不正确'
  }
  static readonly NullEmail = {
    code: 10002,
    msg: '邮箱为空'
  }
  static readonly UserRegisterParams = {
    code: 10003,
    msg: '缺少用户注册相关信息'
  }
  static readonly EmailCodeMismatch = {
    code: 10004,
    msg: '验证码或邮箱错误'
  }
  static readonly VerificationCodeExpired = {
    code: 10005,
    msg: '邮箱尚未获取验证码或验证码已过期，请重新获取后再注册'
  }
  static readonly RepeatRequestEmailCode = {
    code: 10006,
    msg: '在规定时间内重复请求验证码'
  }
  static readonly AlreadyRegistered = {
    code: 10007,
    msg: '此邮箱已注册，请勿重复注册'
  }
  static readonly AccountPasswordNotMatch = {
    code: 10008,
    msg: '账号密码不匹配,请核对后重试'
  }
  static readonly TokenExpired = {
    code: 10009,
    msg: '登录已过期，请重新登录'
  }
  static readonly MissingToken = {
    code: 10010,
    msg: '用户未登录，请登录'
  }
  static readonly ParamsErr = {
    code: 10011,
    msg: '参数错误'
  }
  static readonly NotUser ={
    code: 10012,
    msg: '用户不存在，请先注册'
  }
  static readonly DuplicateErr = {
    code: 11001,
    msg: '复制问卷失败,请核对问卷后重试'
  }
  static readonly UpdateErr = {
    code: 11002,
    msg: '更新失败'
  }
  static readonly PublishedStatusErr = {
    code: 11003,
    msg: '发布或取消发布失败'
  }
}
export const errorcode = {
  ...paramsErrorcode
}
export const getCodeMsg = (code: ParamsError) => errorcode[code]
//paramsErrorcode[ParamsError.EmailParams]
