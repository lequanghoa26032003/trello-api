import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

const LABEL_COLLECTION_NAME = 'labels'

const LABEL_COLLECTION_SCHEMA = Joi.object({
  cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  color: Joi.string().required().min(7).max(7).regex(/^#[0-9A-Fa-f]{6}$/).message('Color must be a valid hex code'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
})

const createNewLabel = async (data) => {
  try {
    const validData = await LABEL_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
    const db = await GET_DB()
    return await db.collection(LABEL_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const getLabels = async () => {
  try {
    const db = await GET_DB()
    const result = await db.collection(LABEL_COLLECTION_NAME).find().toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getLabelById = async (id) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(LABEL_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const labelModel = {
  LABEL_COLLECTION_NAME,
  LABEL_COLLECTION_SCHEMA,
  createNewLabel,
  getLabels,
  getLabelById
}
