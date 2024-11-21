
import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import { authMiddlewares } from '~/middlewares/authMiddlewares.js'

const Router = express.Router()
Router.route('/')
  .post(authMiddlewares.isAuthorized, columnValidation.createNew, columnController.createNew)
Router.route('/:id')
  .put(authMiddlewares.isAuthorized, columnValidation.update, columnController.update)
  .delete(authMiddlewares.isAuthorized, columnController.deleteItem, columnController.deleteItem)
export const ColumnRoute = Router