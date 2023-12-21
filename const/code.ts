export enum ParamsError {
  EmailParams = 10001,
  NullEmail = 10002
}
const paramsErrorcode = {
  10001: '邮箱格式不正确',
  10002: '邮箱为空'
}
export class ErrorList {
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
}
export const errorcode = {
  ...paramsErrorcode
}
export const getCodeMsg = (code: ParamsError) => errorcode[code]
//paramsErrorcode[ParamsError.EmailParams]
