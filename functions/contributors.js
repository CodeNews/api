const mongodb = require('../lib/mongodb')
const util = require('../lib/util')
const tableContributors = 'contributors'

module.exports = async (event, context) => {
  const params = event.queryStringParameters || {}
  if (!params.token) return util.bind(new Error('Informe o token do contribuidor!'))

  try {
    await mongodb.connect()
    const contributor = await mongodb(tableContributors).findOne({ key: params.token })
    if (!contributor || !contributor._id) return util.bind(new Error('Este token de contribuidor não é válido!'))

    return util.bind({ message: 'success listed', data: contributor })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
