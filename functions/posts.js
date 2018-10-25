const mongodb = require('../lib/mongodb')
const util = require('../lib/util')
const tablePosts = 'posts'

module.exports = async (event, context) => {
  try {
    await mongodb.connect()
    var data = await mongodb(tablePosts).find({}).toArray()
    return util.bind({ message: 'success listed', data: data })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
