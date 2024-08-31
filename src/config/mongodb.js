
//
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment.js'

let TrelloDatabaseInstance = null
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi:{
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  TrelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}
export const GET_DB = async () => {
  if (!TrelloDatabaseInstance) throw new Error('Please call CONNECT_DB first')
  return TrelloDatabaseInstance
}
export const COLSE_DB = async () => {
  await mongoClientInstance.close()
}