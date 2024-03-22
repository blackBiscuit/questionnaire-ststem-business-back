import Koa from 'koa'
import http from 'http'
import koaBody, { HttpMethodEnum } from 'koa-body'
import koaJwt from 'koa-jwt'
import cors from '@koa/cors'
import { autoRouter, getIpAddress } from './utils'
import responseMiddleware from './middleware/response'
import verifyUserTokenMiddleware from './middleware/verifyUserToken'
// import questionRouter from './router/question'
// import requireDirectory from 'require-directory'
import { NO_NEED_TOKEN, TOKEN_SECRET } from './const/index'
const port = 3002
const app = new Koa()
app.use(cors())
app.use(responseMiddleware)
app.use(verifyUserTokenMiddleware)
app.use(
  koaJwt({
    secret: TOKEN_SECRET
  }).unless({
    path: NO_NEED_TOKEN
  })
)

app.use(
  koaBody({
    multipart: true,
    parsedMethods: [
      HttpMethodEnum.DELETE,
      HttpMethodEnum.POST,
      HttpMethodEnum.PATCH,
      HttpMethodEnum.PUT
    ]
  })
)
// app.use(questionRouter.routes()).use(questionRouter.allowedMethods())
const server = http.createServer(app.callback())
// 自动注册路由
autoRouter(app)
server.listen(port)
server.on('listening', () => {
  const ip = getIpAddress()

  const address = `http://${ip}:${port}`

  const localAddress = `http://localhost:${port}`

  console.log(`app started at address \n\n${localAddress}\n\n${address}`)
})
