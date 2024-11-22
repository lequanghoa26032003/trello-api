
import express from 'express'
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'
import { authMiddlewares } from '~/middlewares/authMiddlewares.js'
const Router = express.Router()
Router.route('/')
  .get( authMiddlewares.isAuthorized, boardController.getBoards)
  .post(authMiddlewares.isAuthorized, boardValidation.createNew, boardController.createNew )
Router.route('/:id')
  .get(authMiddlewares.isAuthorized, boardController.getDetails)
  .put(authMiddlewares.isAuthorized, boardValidation.update, boardController.update)

Router.route('/supports/moving_card')
  .put(authMiddlewares.isAuthorized, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)
export const BoardRoute = Router