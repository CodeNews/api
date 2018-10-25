const mongodb = require('../lib/mongodb')
const ObjectId = require('mongodb').ObjectId
const util = require('../lib/util')
const tablePosts = 'posts'
const tableContributors = 'contributors'

module.exports = async (event, context) => {
  const params = event.queryStringParameters || {}
  console.log(params)

  try {
    await mongodb.connect()
    const filter = {}
    var data = null

    if (params.id) {
      filter._id = ObjectId(params.id)
      data = await mongodb(tablePosts).findOne(filter)
      data.contributor = await mongodb(tableContributors).findOne({_id: data.contributor})
    } else {
      data = await mongodb(tablePosts).find(filter).toArray()
    }

    return util.bind({ message: 'success listed', data: data })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
