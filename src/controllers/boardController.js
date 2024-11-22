
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'
import { boardRoute } from '~/routes/v1/boardRoute'
const createNew = async (req, res, next) => {
  try {
    const createBoard= await boardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    next(error)
  }
}
const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board= await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}
const update = async (req, res, next) => {
  try {

    const boardId = req.params.id
    const updatedBoard= await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}
const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {next(error)}
}
const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page, itemsPerPage } = req.query
    const boards = await boardService.getBoards(userId, page, itemsPerPage)
    res.status(StatusCodes.OK).json(boards)
  } catch (error) {
    next(error)
  }
}
export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}