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
  if (!body.title) return util.bind(new Error('Informe o título do post!'))
  if (!body.author) return util.bind(new Error('Informe o autor original do post!'))
  if (!body.category) return util.bind(new Error('Informe a categoria do post!'))
  if (!body.category_class) return util.bind(new Error('Informe a classe da categoria do post!'))
  if (!body.image) return util.bind(new Error('Informe a image do post!'))
  if (!body.url_complete) return util.bind(new Error('Informe a URL do post!'))
  if (!body.description) return util.bind(new Error('Digite o conteúdo do post!'))

  try {
    await mongodb.connect()
    if (body.draft) {
      const id = ObjectId(body._id)
      const contributor = await mongodb(tableContributors).findOne({ key: params.token })
      body.contributor = contributor._id
      delete body._id
      delete body.draft
      await mongodb(tablePosts).insert(body)
      await mongodb(tablePostsDraft).remove({ _id: id })
    } else {
      if (body._id) {
        const id = ObjectId(body._id)
        delete body._id
        delete body.draft
        const postOrigem = await mongodb(tablePosts).findOne({ _id: id })
        body.contributor = postOrigem.contributor
        await mongodb(tablePosts).update({ _id: id }, body)
      } else {
        const contributor = await mongodb(tableContributors).findOne({ key: params.token })
        body.contributor = contributor._id
        body.datetime = new Date().getTime()
        await mongodb(tablePosts).insert(body)
      }
    }

    return util.bind({ message: 'success inserted', data: {} })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
