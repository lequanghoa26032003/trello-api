
import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, COLSE_DB } from '~/config/mongodb.js'
import { env } from '~/config/environment.js'
import { APIs_V1 } from '~/routes/v1/index.js'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware.js'
import { corsOptions } from '~/config/cors'
import cookieParser from 'cookie-parser'
const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello ${env.AUTHOR}, I am running at http://${ env.APP_HOST }:${ env.APP_PORT }/`)
  })
  exitHook( () => {
    COLSE_DB()
  })
}

( async () => {
  try {
    // eslint-disable-next-line no-console
    console.log('Connecting to MongoDB...')
    await CONNECT_DB()
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB!')
    START_SERVER()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(0)
  }
})()

