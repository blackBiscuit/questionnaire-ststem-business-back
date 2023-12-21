import nodemailer from 'nodemailer'
import Code from './code'
import { CODE_EXPIRATION_TIME } from '../const'
export const nodeMail = nodemailer.createTransport({
  service: '163', //类型qq邮箱
  port: 465, //上文获取的port
  secure: true, //上文获取的secure
  auth: {
    user: 'heibulinbinggan@163.com', // 发送方的邮箱，可以选择你自己的qq邮箱
    pass: 'KLRSRUORFDSDFHDA' // 上文获取的stmp授权码
  }
})
export const sendHtmlEmail = (email: string, code: string) => {
  const receiver = {
    // 发件人 邮箱  '昵称<发件人邮箱>'
    from: `"cookie"<heibulinbinggan@163.com>`,
    // 主题
    subject: '验证码',
    // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
    to: email,
    // 可以使用html标签
    html: `
       <h1 style="color: #007ACC;">邮箱验证码:</h1>
       <p>
         您正在进行帐号相关操作，验证码：
       </p>
       <h2>
           ${code}
       </h2>
       <p>验证码五分钟内有效,请及时输入验证码。若非本人操作，请忽视此邮件。</p>
       `
  }
  nodeMail.sendMail(receiver, (error, info) => {
    if (error) {
      return console.log('发送失败:', error)
    }
    nodeMail.close()
    console.log('发送成功:', info.response)
  })
}
export const sendEmail = (email: string, code: string) => {
  sendHtmlEmail(email, code)
  Code.addEmail(
    email,
    code,
    setTimeout(async () => {
      // 到时间清除过期验证码
      await Code.removeEmail(email)
    }, CODE_EXPIRATION_TIME)
  )
}
