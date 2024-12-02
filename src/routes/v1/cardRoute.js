
import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddlewares } from '~/middlewares/authMiddlewares.js'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'


const Router = express.Router()
Router.route('/')
  .post(authMiddlewares.isAuthorized, cardValidation.createNew, cardController.createNew)
Router.route('/:id')
  .put(
    authMiddlewares.isAuthorized,
    multerUploadMiddleware.upload.single('cardCover'),
    cardValidation.update,
    cardController.update
  )
export const CardRoute = Router