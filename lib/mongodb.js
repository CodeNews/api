const { MongoClient } = require('mongodb')
const CONFIG = require('../config.json')
const MONGO_DB_URI = CONFIG.MONGO_DB_URI

console.log(MONGO_DB_URI)

let connection

const defaultConnectionConfig = {
  ignoreUndefined: true
}

const getCollection = collectionName => connection.collection(collectionName)

const connect = async () => {
  try {
    if (connection && connection.serverConfig.isConnected()) {
      return connection
    }
    const connect = await MongoClient.connect(MONGO_DB_URI, defaultConnectionConfig)
    connection = connect.db('codenews')
    return connection
  } catch (error) {
    throw error
  }
}

module.exports = getCollection
module.exports.connect = connect
