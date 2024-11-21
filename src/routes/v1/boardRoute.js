
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'
import { authMiddlewares } from '~/middlewares/authMiddlewares.js'
const Router = express.Router()
Router.route('/')
  .get( (req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'Board Routes'
    })
  })
  .post(authMiddlewares.isAuthorized, boardValidation.createNew, boardController.createNew )
Router.route('/:id')
  .get(authMiddlewares.isAuthorized, boardController.getDetails)
  .put(authMiddlewares.isAuthorized, boardValidation.update, boardController.update)

Router.route('/supports/moving_card')
  .put(authMiddlewares.isAuthorized, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)
export const BoardRoute = Router