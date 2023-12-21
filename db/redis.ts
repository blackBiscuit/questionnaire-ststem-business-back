import {createClient} from 'redis'
export const redisClient = createClient({url:'redis://127.0.0.1:6379'})
redisClient
  .on('err', (error) => {
    console.log(error)
  })
  .connect()
redisClient.set('328382@ffj.com', 'kdkdkde')
// setTimeout(async () => {
//   const v = await redisClient.get('328382@ffj.com')
//   console.log(v)
// }, 1000)
