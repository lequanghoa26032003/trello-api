
import express from 'express'
import { invitationValidation } from '~/validations/invitationValidation'
import { invitationController } from '~/controllers/invitationController'
import { authMiddlewares } from '~/middlewares/authMiddlewares.js'


const Router = express.Router()
Router.route('/board')
  .post(
    authMiddlewares.isAuthorized,
    invitationValidation.createNewBoardInvitation,
    invitationController.createNewBoardInvitation
  )
Router.route('/')
  .get(authMiddlewares.isAuthorized, invitationController.getInvitations)
Router.route('/board/:invitationId')
  .put(
    authMiddlewares.isAuthorized,
    invitationController.updateBoardInvitation
  )
export const invitationRoute = Router