
import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { userModel } from './userModel'
import { pagingSkipValue } from '~/utils/algorithms'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).max(256).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().required().valid( ...Object.values(BOARD_TYPES) ),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updateAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FILELDS = ['_id', 'createdAt']
const validateBeforeCreate = async ( data ) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const createNew = async (userId, data ) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newBoardToAdd = {
      ...validData,
      ownerIds: [new ObjectId(userId)]
    }
    const db = await GET_DB()
    return await db.collection(BOARD_COLLECTION_NAME).insertOne(newBoardToAdd)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async ( id ) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).findOne({ _id:  id } )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async ( userId, boardId ) => {
  try {
    const queryConditions = [
      { _id: new ObjectId(boardId) },
      { _destroy: false },
      { $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } },
        { memberIds: { $all: [new ObjectId(userId)] } }
      ] }
    ]
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $lookup:{
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup:{
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'ownerIds',
          foreignField: '_id',
          as: 'owners',
          // pipeline trong lookup là để xử lý một hoặc nhiều luồng cần thiết
          // $project để chỉ định vài field không muốn lấy về bằng cách gán nó giá trị 0
          pipeline: [
            {
              $project: { 'password': 0, 'verifyToken': 0 }
            }
          ]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'memberIds',
          foreignField: '_id',
          as: 'members',
          pipeline: [
            {
              $project: { 'password': 0, 'verifyToken': 0 }
            }
          ]
        }
      }
    ]).toArray()
    return result[0]||null
  } catch (error) {
    throw new Error(error)
  }
}
const pushColumnOrderIds = async (column) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds:  new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  }
  catch (error) { throw error }
}
const pullColumnOrderIds = async (column) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds:  new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  }
  catch (error) { throw error }
}
const update = async (boardId, updateData) => {
  try {
    Object.keys(updateData).forEach( fieldName => {
      if (INVALID_UPDATE_FILELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(_id)) )
    }
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }
  catch (error) { throw error }
}

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    const queryConditions = [
      { _destroy: false },
      { $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } },
        { memberIds: { $all: [new ObjectId(userId)] } }
      ] }
    ]
    const db = await GET_DB()
    const query = await db.collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $sort: { title: 1 } },
      { $facet: {
        'queryBoards': [
          { $skip: pagingSkipValue(page, itemsPerPage) },
          { $limit: itemsPerPage }
        ],
        'queryTotalBoards': [{ $count: 'countedAllBoards' }]
      }
      }
    ],
    { collation: { locale: 'en' } }
    ).toArray()
    // console.log(query)
    const res = query[0]
    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0
    }
  }
  catch (error) { throw error }
}
export const boardModel ={
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  getBoards
}

