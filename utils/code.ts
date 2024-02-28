import { CODE_EXPIRATION_TIME, CODE_REQUEST_TIME } from '../const'
import { redisClient } from '../db/redis'
interface CodeEmailObjectValue {
  codeExpirationTimer: NodeJS.Timeout
  // possibleToRequest: boolean // false 表示在规定时间内已经请求过了
  possibleToRequestTimer: NodeJS.Timeout | null
}
interface EmailProps {
  possibleToRequest: boolean // false 表示在规定时间内已经请求过了
  code: string
}
class Code {
  private static emailObj: Record<string, CodeEmailObjectValue> = {}
  static addEmail(email: string, code: string) {
    if (Code.emailObj[email]) {
      clearTimeout(Code.emailObj[email].codeExpirationTimer)
    }
    //Code.setCode(email, code)
    Code.setEmailInfo(email, {
      code,
      possibleToRequest: false
    })
    Code.emailObj[email] = {
      codeExpirationTimer: setTimeout(async () => {
        // 到时间清除过期验证码
        await Code.removeEmail(email)
      }, CODE_EXPIRATION_TIME),
      possibleToRequestTimer: Code.emailObj[email]?.possibleToRequestTimer
        ? Code.emailObj[email].possibleToRequestTimer
        : setTimeout(() => {
          // 到期可再次请求验证码
            Code.setPossibleToRequest(email, true)
            if (Code.emailObj[email]) {
              Code.emailObj[email].possibleToRequestTimer = null
            }
          }, CODE_REQUEST_TIME)
    }
  }
  static async removeEmail(email: string) {
    delete Code.emailObj[email]
    try {
      await Code.delCode(email)
    } catch (error) {
      return false
    }
    return true
  }
  static async getCode(email: string) {
    const data = await Code.getEmailInfo(email)
    return data.code
  }
  private static async delCode(email: string) {
    return await redisClient.del(email)
  }
  private static async setEmailInfo(email: string, data: EmailProps) {
    return await redisClient.set(email, JSON.stringify(data))
  }
  private static async setPossibleToRequest(
    email: string,
    possibleToRequest: boolean
  ) {
    const data = await Code.getEmailInfo(email)
    if (data.code) {
      Code.setEmailInfo(email, {
        code: data.code,
        possibleToRequest
      })
    }
  }
  static async getEmailInfo(email: string): Promise<Partial<EmailProps>> {
    const data = await redisClient.get(email)
    return data ? JSON.parse(data) : {}
  }
  static async canRequestEmailCode(email: string) {
    const currentEmail = await Code.getEmailInfo(email)
    const { possibleToRequest = true } = currentEmail
    console.log(possibleToRequest)
    return possibleToRequest
  }
}
export default Code
