const mongodb = require('../lib/mongodb')
const util = require('../lib/util')
const tableContributors = 'contributors'

module.exports = async (event, context) => {
  const params = event.queryStringParameters || {}

  try {
    await mongodb.connect()
    if (params.token) {
      const contributor = await mongodb(tableContributors).findOne({ key: params.token })
      if (!contributor || !contributor._id) return util.bind(new Error('Este token de contribuidor não é válido!'))

      return util.bind({ message: 'success listed', data: contributor })
    }

    const contributors = await mongodb(tableContributors).find({}).sort({ date_start: -1 }).toArray()
    for (var contributor of contributors) {
      delete contributor.key
    }
    return util.bind({ message: 'success listed', data: contributors })
  } catch (error) {
    if (error) return util.bind(error)
  }
}
