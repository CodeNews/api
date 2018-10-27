const mongodb = require('../lib/mongodb')
const util = require('../lib/util')
const tableTags = 'tags'

module.exports = async (event, context) => {
  const params = event.queryStringParameters || {}
  const body = JSON.parse(event.body)

  if (!params.token) return util.bind(new Error('Informe o token do contribuidor!'))
  if (!body.name) return util.bind(new Error('Informe o nome da tag!'))

  try {
    await mongodb.connect()
    const tag = {
      name: body.name,
      color: 'black'
    }
    await mongodb(tableTags).insert(tag)

    return util.bind({ message: 'success inserted', data: {} })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
