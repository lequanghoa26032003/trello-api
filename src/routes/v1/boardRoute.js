/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'
const Router = express.Router()
Router.route('/')
  .get( (req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'Board Routes'
    })
  })
  .post( boardValidation.createNew, boardController.createNew )

  Router.route('/:id')
  .get(boardController.getDetails)
  .put() // Update

export const BoardRoute = Router