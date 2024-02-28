export interface UserInfo {
  email: string
  username: string
}
export interface RegisterUserInfo extends UserInfo {
  password: string
  emailCode: string
}
export interface LoginUser {
  email: string
  password: string
}
export type TokenUserInfo = UserInfo & {
  id: number
}
