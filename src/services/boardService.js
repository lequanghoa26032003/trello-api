/* eslint-disable no-useless-catch */
/**

 */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)
    console.log(createdBoard)
    return createdBoard

  } catch (error) { throw error }
}
export const boardService = {
  createNew
}