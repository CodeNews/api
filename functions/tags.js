const mongodb = require('../lib/mongodb')
const util = require('../lib/util')
const tableTags = 'tags'

module.exports = async (event, context) => {
  const params = event.queryStringParameters || {}
  console.log(params)

  try {
    await mongodb.connect()
    const tags = await mongodb(tableTags).find({}).toArray()

    return util.bind({ message: 'success listed', data: tags })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
