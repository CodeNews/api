const util = require('../lib/util')
const freeloader = require('freeloader-of-data')

module.exports = async (event, context) => {
  const body = JSON.parse(event.body)

  try {
    if (!body || !body.url) return util.bind(new Error('Informe uma URL válida!'))
    const res = await getUrl(body.url)
    return util.bind({ message: 'success listed', data: res })
  } catch (error) {

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
