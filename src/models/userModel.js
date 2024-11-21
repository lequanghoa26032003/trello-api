import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'


const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}
// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),

  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avartar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN).default(USER_ROLES.CLIENT),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FILELDS = ['_id', 'email', 'username', 'createdAt']

const validateBeforeCreate = async ( data ) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const createNew = async ( data ) => {
  try {
    const validData = await validateBeforeCreate(data)
    const db = await GET_DB()
    return await db.collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async ( userId ) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const findOneByEmail = async ( emailValue ) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(USER_COLLECTION_NAME).findOne({ email: emailValue })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach( fieldName => {
      if (INVALID_UPDATE_FILELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    const db = await GET_DB()
    const result = await db.collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }
  catch (error) { throw error }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  update
}