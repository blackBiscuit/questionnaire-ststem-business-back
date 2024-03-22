import { QUESTION_CHECK_NAME, QUESTION_INPUT_NAME, QUESTION_RADIO_NAME, QUESTION_TEXT_AREA_NAME } from "../types/question"
export const DEFAULT_LIST_PAGE_SIZE = 10
export const DEFAULT_LIST_PAGE = 1
export const DEFAULT_STAT_PAGE_SIZE = 10
export const DEFAULT_STAT_PAGE = 1
export const CODE_EXPIRATION_TIME = 5 * 60 * 1000
export const CODE_REQUEST_TIME = 30 * 1000

export const STAT_TYPE = [QUESTION_RADIO_NAME, QUESTION_CHECK_NAME]
export const KEYS_TYPE =  [QUESTION_INPUT_NAME,QUESTION_TEXT_AREA_NAME]
export const TOKEN_SECRET = 'qoq_heibulinxiaobinggan_pop'
export const DEFAULT_QUESTION = {
  title: '新问卷',
  desc: '',
  componentList: '[]',
  answerCount: 0,
  isStar: false,
  isPublished: false,
  isDeleted: false
} as const
export const NO_NEED_TOKEN = [
  /^\/api\/user\/register/,
  /^\/api\/user\/login/,
  /^\/api\/user\/forget/,
  /^\/api\/user\/email\/code/
]
