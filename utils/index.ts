import Koa from 'koa'
import Mock from 'mockjs'
import path from 'path'
import fs from 'fs'
import { ulid } from 'ulid'
import {
  QuestionCheckProps,
  QuestionComponent,
  QuestionInfo,
  QuestionRadioProps
} from '../types/question'
import { STAT_TYPE, KEYS_TYPE } from '../const'
const Random = Mock.Random
export const getIpAddress = () => {
  const interfaces = require('os').networkInterfaces()
  for (const devName in interfaces) {
    const temp = interfaces[devName]

    for (let i = 0; i < temp.length; i++) {
      const alias = temp[i]

      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

export interface QuestionData {
  id: string
  title: string
  answerCount: number
  isStar: boolean
  isPublished: boolean
  createAt: string
  isDeleted: boolean
}
// 0 false 1 true
interface SearchOption {
  keyword: string
  isStar: number
  isDeleted: number
  page: number
  len: number
}

export interface AnswerProps {
  [key: string]: string
}
export const getQuestionData = (opt: Partial<SearchOption> = {}) => {
  const { len = 10, isDeleted, isStar } = opt
  const list: QuestionData[] = []
  for (let i = 0; i < len; i++) {
    list.push({
      id: ulid(),
      title: Random.ctitle(),
      answerCount: Random.natural(50, 100),
      isStar: isStar === 1 ? true : Random.boolean(),
      isPublished: Random.boolean(),
      createAt: Random.datetime(),
      isDeleted: isDeleted === 1 ? true : Random.boolean()
    })
  }
  return list
}
export const autoRouter = async (app: Koa) => {
  const dir = './router'
  const fileList = fs.readdirSync(dir)
  console.log(fileList)
  const filesToImport = fileList.filter((file) => {
    console.log(path.resolve(dir, file))
    return fs.statSync(path.resolve(dir, file)).isFile() && file !== 'index.ts'
  })
  if (filesToImport.length > 0) {
    filesToImport.forEach(async (file) => {
      const module = await import(path.resolve(dir, file))
      const route = module.default
      if (route && typeof route.routes === 'function') {
        app.use(route.routes())
      }
    })
  }
}
export const getQuestionInfo = (id: number) => {
  const questionContent: QuestionInfo = {
    id: id || 0,
    title: '大学生消费情况调查问卷',
    desc: '',
    createAt: '',
    answerCount: 0,
    isStar: false,
    isPublished: true,
    isDeleted: false,
    componentList: [
      {
        component_id: 'c1',
        type: 'questionTitle',
        title: '当代大学生消费情况的调查问卷',
        isHidden: false,
        isLocked: false,
        props: {
          level: 2,
          text: '当代大学生消费情况的调查问卷',
          isCenter: false
        }
      },
      {
        title: '大学生问卷调查',
        component_id: 'c2',
        type: 'questionInfo',
        props: {
          title: '大学生问卷调查',
          desc: '这是一个有关大学生消费情况的问卷调查表'
        }
      },
      {
        component_id: 'c3',
        type: 'questionRadio',
        title: '性别',
        isHidden: false,
        isLocked: false,
        props: {
          title: '您的性别 男 | 女',
          options: [
            {
              text: '男',
              value: ulid()
            },
            {
              text: '女',
              value: ulid()
            }
          ],
          required: true
        }
      },
      {
        title: '年级',
        component_id: 'c4',
        type: 'questionRadio',
        props: {
          title: '您的年级是',
          value: '',
          options: [
            {
              value: ulid(),
              text: '大一'
            },
            {
              value: ulid(),
              text: '大二'
            },
            {
              value: ulid(),
              text: '大三'
            },
            {
              value: ulid(),
              text: '大四'
            }
          ],
          isVertical: true
        }
      },
      {
        title: '平均月消费',
        component_id: 'c5',
        type: 'questionRadio',
        props: {
          title: '您在校期间的平均月消费',
          value: '',
          options: [
            {
              value: ulid(),
              text: '600-1000 '
            },
            {
              value: ulid(),
              text: '1000-1500 '
            },
            {
              value: ulid(),
              text: '1500-2000 '
            },
            {
              value: ulid(),
              text: '2000以上'
            }
          ],
          isVertical: true
        }
      },
      {
        title: '生活费来源',
        component_id: 'c6',
        type: 'questionRadio',
        props: {
          title: '您的生活费来源',
          value: '',
          options: [
            {
              value: ulid(),
              text: '全部来自家庭'
            },
            {
              value: ulid(),
              text: '部分来自家庭，部分靠自己赚取'
            },
            {
              value: ulid(),
              text: '全部靠自己赚取'
            }
          ],
          isVertical: true
        }
      },
      {
        title: '消费分布',
        component_id: 'c7',
        type: 'questionCheck',
        props: {
          title: '您的月消费多用在哪些方面',
          list: [
            {
              value: ulid(),
              text: '伙食',
              checked: false
            },
            {
              value: ulid(),
              text: '购置衣物',
              checked: false
            },
            {
              value: ulid(),
              text: '交通通讯',
              checked: false
            },
            {
              value: ulid(),
              text: '生活用品',
              checked: false
            },
            {
              value: ulid(),
              text: '日常交际',
              checked: false
            },
            {
              value: ulid(),
              text: '学习用品',
              checked: false
            },
            {
              value: ulid(),
              text: '娱乐旅游',
              checked: false
            }
          ],
          isVertical: true
        }
      },
      {
        title: '消费分布',
        component_id: 'c8',
        type: 'questionCheck',
        props: {
          title: '您的月消费多用在哪些方面',
          list: [
            {
              value: ulid(),
              text: '伙食',
              checked: false
            },
            {
              value: ulid(),
              text: '购置衣物',
              checked: false
            },
            {
              value: ulid(),
              text: '交通通讯',
              checked: false
            },
            {
              value: ulid(),
              text: '生活用品',
              checked: false
            },
            {
              value: ulid(),
              text: '日常交际',
              checked: false
            },
            {
              value: ulid(),
              text: '学习用品',
              checked: false
            },
            {
              value: ulid(),
              text: '娱乐旅游',
              checked: false
            }
          ],
          isVertical: true
        }
      },
      {
        title: '消费分布',
        component_id: 'c9',
        type: 'questionCheck',
        props: {
          title: '您的月消费多用在哪些方面',
          list: [
            {
              value: ulid(),
              text: '伙食',
              checked: false
            },
            {
              value: ulid(),
              text: '购置衣物',
              checked: false
            },
            {
              value: ulid(),
              text: '交通通讯',
              checked: false
            },
            {
              value: ulid(),
              text: '生活用品',
              checked: false
            },
            {
              value: ulid(),
              text: '日常交际',
              checked: false
            },
            {
              value: ulid(),
              text: '学习用品',
              checked: false
            },
            {
              value: ulid(),
              text: '娱乐旅游',
              checked: false
            }
          ],
          isVertical: true
        }
      },
      {
        title: '消费分布',
        component_id: 'c10',
        type: 'questionCheck',
        props: {
          title: '您的月消费多用在哪些方面',
          list: [
            {
              value: ulid(),
              text: '伙食',
              checked: false
            },
            {
              value: ulid(),
              text: '购置衣物',
              checked: false
            },
            {
              value: ulid(),
              text: '交通通讯',
              checked: false
            },
            {
              value: ulid(),
              text: '生活用品',
              checked: false
            },
            {
              value: ulid(),
              text: '日常交际',
              checked: false
            },
            {
              value: ulid(),
              text: '学习用品',
              checked: false
            },
            {
              value: ulid(),
              text: '娱乐旅游',
              checked: false
            }
          ],
          isVertical: true
        }
      }
    ],
    startTime: null,
    endTime: null
  }
  return questionContent
}
const getRandomTwoInteger = (min?: number, max?: number): [number, number] => {
  const firstNum = Random.integer(min, max)
  let nextNum = Random.integer(min, max)
  while (firstNum === nextNum) {
    nextNum = Random.integer(min, max)
  }
  return [firstNum, nextNum]
}
export const getAnswerDataList = (id: number, len = 10) => {
  const { componentList } = getQuestionInfo(id)
  const answerDataList: AnswerProps[] = []
  for (let i = 0; i < len; i++) {
    const answerData: AnswerProps = {
      id: ulid()
    }
    componentList.forEach((component) => {
      const { type, component_id, props } = component
      switch (type) {
        case 'questionInput':
          answerData[component_id] = Random.ctitle()
          break
        case 'questionTextArea':
          answerData[component_id] = Random.ctitle()
          break
        case 'questionRadio':
          const index = Random.integer(0, props?.options.length! - 1)

          answerData[component_id] = props?.options[index].text || ''
          break
        case 'questionCheck':
          const twoInteger = getRandomTwoInteger(0, props?.list.length! - 1)
          const first = props?.list[twoInteger[0]].text
          const next = props?.list[twoInteger[1]].text
          answerData[component_id] = `${first},${next}`
      }
    })
    answerDataList.push(answerData)
  }
  return answerDataList
}
// [{c3: }]
interface AnswerStat {
  name: string
  count: number
}
export const getAnswerDataListCount = (
  componentId: string,
  componentList: QuestionComponent[],
  answerList: AnswerProps[]
) => {
  // const { componentList } = getQuestionInfo(questionId)
  //const answerList = getAnswerDataList(questionId, total)
  const currentComponent = componentList.find(
    (component) => component.component_id === componentId
  )
  const noAnswer = [] as AnswerStat[]
  if (!currentComponent) return noAnswer
  const { type } = currentComponent
  if (!STAT_TYPE.includes(type)) return noAnswer
  const answerAry = handleQuestionStatCount[type](
    componentId,
    currentComponent,
    answerList
  )
  return answerAry
}
const handleQuestionStatCount: Record<
  //QuestionComponentType,
  string,
  (
    componentId: string,
    component: QuestionComponent,
    answerList: AnswerProps[]
  ) => AnswerStat[]
> = {
  questionCheck: (componentId: string, _component, answerList) => {
    const component = _component as QuestionCheckProps
    const answerAry: AnswerStat[] = []
    component.props?.list.forEach((select) => {
      answerAry.push({
        name: select.text,
        count: 0
      })
    })
    answerList.forEach((answer) => {
      // [日常交际,生活用品]
      const options = answer[componentId].split(',')
      options.forEach((option) => {
        const findAnswerOption = answerAry.find(
          (answer) => answer.name == option
        )
        if (findAnswerOption) {
          findAnswerOption.count += 1
        }
      })
    })
    return answerAry
  },
  questionRadio: (componentId: string, _component, answerList) => {
    const component = _component as QuestionRadioProps
    const answerAry: AnswerStat[] = []
    component.props?.options.forEach((select) => {
      answerAry.push({
        name: select.text,
        count: 0
      })
    })
    answerList.forEach((answer) => {
      // [日常交际,生活用品]
      const selectedVal = answer[componentId]
      const findAnswerOption = answerAry.find(
        (answer) => answer.name == selectedVal
      )
      if (findAnswerOption) {
        findAnswerOption.count += 1
      }
    })
    return answerAry
  }
}
export const getAnswerDataListKeys = (
  componentId: string,
  componentList: QuestionComponent[],
  answerList: AnswerProps[]
) => {
  const currentComponent = componentList.find(
    (component) => component.component_id === componentId
  )
  const keys: string[] = []
  if (!currentComponent || !KEYS_TYPE.includes(currentComponent.type))
    return keys
  answerList.forEach((answer) => {
    const key = answer[componentId]
    keys.push(key)
  })
  return keys
}
