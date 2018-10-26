const mongodb = require('../lib/mongodb')
const ObjectId = require('mongodb').ObjectId
const util = require('../lib/util')
const tablePosts = 'posts'
const tableContributors = 'contributors'
const tablePostsDraft = 'posts_draft'

module.exports = async (event, context) => {
  const params = event.queryStringParameters || {}
  console.log(params)

  try {
    await mongodb.connect()
    const filter = {}
    var data = null

    if (params.token) {
      const contributor = await mongodb(tableContributors).findOne({ key: params.token })
      if (!contributor || !contributor._id) return util.bind(new Error('Este token de contribuidor não é válido!'))

      data = await mongodb(tablePostsDraft).find({ contributor: contributor._id }).sort({ _id: -1 }).toArray()
      const posts = await mongodb(tablePosts).find({ contributor: contributor._id }).sort({ _id: -1 }).toArray()
      data = data.concat(posts)
      return util.bind({ message: 'success listed', data: data })
    }

    if (params.id) {
      filter._id = ObjectId(params.id)
      data = await mongodb(tablePosts).findOne(filter)
      data.contributor = await mongodb(tableContributors).findOne({ _id: data.contributor })
    } else {
      data = await mongodb(tablePosts).find(filter).toArray()
    }

    return util.bind({ message: 'success listed', data: data })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
