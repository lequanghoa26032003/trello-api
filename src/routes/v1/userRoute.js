
import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
const Router = express.Router()
Router.route('/register')
  .post(userValidation.createNew, userController.createNew)
Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)
Router.route('/login')
  .post(userValidation.login, userController.login)
Router.route('/logout')
  .delete(userController.logout)
Router.route('/refresh_token')
  .get(userController.refreshToken)
Router.route('/update')
  .put(
    authMiddlewares.isAuthorized,
    multerUploadMiddleware.upload.single('avatar'),
    userValidation.update,
    userController.update)

export const UserRoute = Router