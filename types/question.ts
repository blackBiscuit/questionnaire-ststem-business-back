export const QUESTION_INPUT_NAME = 'questionInput'
export type QuestionInputName = typeof QUESTION_INPUT_NAME
export const QUESTION_INFO_NAME = 'questionInfo'
export type QuestionInfoName = typeof QUESTION_INFO_NAME
export const QUESTION_PARAGRAPH_NAME = 'questionParagraph'
export type QuestionParagraphName = typeof QUESTION_PARAGRAPH_NAME
export const QUESTION_RADIO_NAME = 'questionRadio'
export type QuestionRadioName = typeof QUESTION_RADIO_NAME
export const QUESTION_TEXT_AREA_NAME = 'questionTextArea'
export type QuestionTextAreaName = typeof QUESTION_TEXT_AREA_NAME
export const QUESTION_TITLE_NAME = 'questionTitle'
export type QuestionTitleName = typeof QUESTION_TITLE_NAME
export const QUESTION_CHECK_NAME = 'questionCheck'
export type QuestionCheckName = typeof QUESTION_CHECK_NAME
export type QuestionComponentType =
  | QuestionInputName
  | QuestionTitleName
  | QuestionParagraphName
  | QuestionInfoName
  | QuestionTextAreaName
  | QuestionRadioName
  | QuestionCheckName
interface QuestionPublicProps {
  title?: string
  component_id: string
  isHidden?: boolean
  isLocked?: boolean
}
export interface RadioOptionType {
  text: string
  value: string
}
export interface CheckOptionType {
  text: string
  value: string
  checked: boolean
}
// 后端返回props
export type QuestionTitleProps = QuestionPublicProps & {
  type: QuestionTitleName
  props?: QuestionTitlePropsType
}
export type QuestionInputProps = QuestionPublicProps & {
  type: QuestionInputName
  props?: QuestionInputPropsType
}
export type QuestionInfoProps = QuestionPublicProps & {
  type: QuestionInfoName
  props?: QuestionInfoPropsType
}

export type QuestionParagraphProps = QuestionPublicProps & {
  type: QuestionParagraphName
  props?: QuestionParagraphPropsType
}
export type QuestionRadioProps = QuestionPublicProps & {
  type: QuestionRadioName
  props?: QuestionRadioPropsType
}
export type QuestionTextAreaProps = QuestionPublicProps & {
  type: QuestionTextAreaName
  props?: QuestionTextAreaPropsType
}
export type QuestionCheckProps = QuestionPublicProps & {
  type: QuestionCheckName
  props?: QuestionCheckPropsType
}
// 前端组件props
export interface QuestionInputPropsType {
  title?: string
  placeholder?: string
  required?: boolean
}
export interface QuestionTitlePropsType {
  level?: 1 | 2 | 3
  isCenter?: boolean
  text?: string
}
export interface QuestionTextAreaPropsType {
  title?: string
  placeholder?: string
  required?: boolean
}
export interface QuestionRadioPropsType {
  title?: string
  isVertical?: boolean
  options: RadioOptionType[]
  value?: string
  required?: boolean
}
export interface QuestionParagraphPropsType {
  text?: string
  isCenter?: boolean
}
export interface QuestionInfoPropsType {
  title?: string
  desc?: string
}
export interface QuestionCheckPropsType {
  title?: string
  isVertical?: boolean
  list: CheckOptionType[]
  required?: boolean
}
// 后端类型
export type QuestionComponent =
  | QuestionTitleProps
  | QuestionInputProps
  | QuestionParagraphProps
  | QuestionInfoProps
  | QuestionTextAreaProps
  | QuestionRadioProps
  | QuestionCheckProps
// 前端类型
export type QuestionComponentPropsType =
  | QuestionInputPropsType
  | QuestionTitlePropsType
  | QuestionInfoPropsType
  | QuestionParagraphPropsType
  | QuestionRadioPropsType
  | QuestionTextAreaPropsType
  | QuestionCheckPropsType
export interface QuestionInfo {
  id: number
  title: string
  desc?: string
  css?: string
  js?: string
  componentList: QuestionComponent[]
  answerCount: number
  isStar: boolean
  isPublished: boolean
  createAt: string
  isDeleted: boolean
}
type OmitName = 'id' | 'answerCount' | 'createAt'
export type QuestionOpt = Partial<Omit<QuestionInfo, OmitName>>
export type QuestionServiceOpt =
  | Omit<QuestionOpt, 'componentList'>
  | {
      componentList: string
    }
export type UpdateQuestionsOpt = Partial<
  Omit<QuestionInfo, 'id' | 'createAt'>
> & {
  id: number
}
