const mongodb = require('../lib/mongodb')
const util = require('../lib/util')
const freeloader = require('freeloader-of-data')
const tablePosts = 'posts'

module.exports = async (event, context) => {
  const body = JSON.parse(event.body)

  try {
    if (!body || !body.url) return util.bind(new Error('Informe uma URL válida!'))
    await mongodb.connect()
    if (!body.id) {
      const post = await mongodb(tablePosts).findOne({ url_complete: body.url })
      if (post && post._id) return util.bind(new Error('Este post com essa URL já foi publicado!'))
    }

    const res = await getUrl(body.url)
    return util.bind({ message: 'success listed', data: res })
  } catch (error) {
    if (error) return util.bind(error)
  }
}

const getUrl = async (url) => {
  return new Promise(async (resolve, reject) => {
    freeloader(url, (err, meta) => {
      if (err) reject(err)
      resolve(meta)
    })
  })
}
