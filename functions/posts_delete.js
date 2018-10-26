const mongodb = require('../lib/mongodb')
const ObjectId = require('mongodb').ObjectId
const util = require('../lib/util')
const tablePostsDraft = 'posts_draft'
const tablePosts = 'posts'
const tableContributors = 'contributors'

module.exports = async (event, context) => {
  const params = event.queryStringParameters || {}
  const body = JSON.parse(event.body)

  if (!params.token) return util.bind(new Error('Informe o token do contribuidor!'))
  if (!body._id) return util.bind(new Error('Informe o ID do post!'))

  try {
    await mongodb.connect()
    const contributor = await mongodb(tableContributors).findOne({ key: params.token })
    if (!contributor || !contributor._id) return util.bind(new Error('Token do contribuidor não é válido!'))
    const id = ObjectId(body._id)

    if (body.draft) {
      await mongodb(tablePostsDraft).remove({ _id: id })
    } else {
      await mongodb(tablePosts).remove({ _id: id })
    }

    return util.bind({ message: 'success deleted', data: {} })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
