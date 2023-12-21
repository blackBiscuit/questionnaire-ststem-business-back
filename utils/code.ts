import { redisClient } from '../db/redis'
class Code {
  static emailObj: Record<string, NodeJS.Timeout> = {}
  static addEmail(email: string, code: string, fn: NodeJS.Timeout) {
    if(Code.emailObj[email]) {
      clearTimeout(Code.emailObj[email])
    }
    Code.setCode(email, code)
    Code.emailObj[email] = fn
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
  private static async setCode(email: string, code: string) {
    return await redisClient.set(email, code)
  }
  static async getCode(email: string) {
    return await redisClient.get(email)
  }
  private static async delCode(email: string) {
    return await redisClient.del(email)
  }
}
export default Code
