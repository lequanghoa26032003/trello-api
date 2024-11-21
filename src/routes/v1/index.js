
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { BoardRoute } from './boardRoute.js'
import { ColumnRoute } from './columnRoute.js'
import { CardRoute } from './cardRoute.js'
import { UserRoute } from './userRoute.js'


const Router = express.Router()

Router.get ('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'Api is running!'
  })
})
Router.use('/boards', BoardRoute)
Router.use('/columns', ColumnRoute)
Router.use('/cards', CardRoute)
Router.use('/users', UserRoute)


export const APIs_V1 = Router
