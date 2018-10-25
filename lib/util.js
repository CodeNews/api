const moment = require('moment')
const axios = require('axios')

axios.defaults.headers.common['Authorization'] = 'Basic MTE1ZWU2MWItNTgxYy00YjVhLWI0ZmEtMGMxOGRmYmUyMGM5'
const appId = '71ae231c-b856-460a-94ab-eeaccf99a9f4'
const appIdAdmin = 'd0a4edf0-afe5-4382-ac8f-7943bf5ce1eb'

const removeEmpty = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
    else if (obj[key] == null || obj[key] === '') delete obj[key]
  })

  return obj
}

function formatTransactions (transactions, body) {
  const trans = { idapi: body.idapi, email: body.email, transactions: [] }
  for (const transaction of transactions) {
    if (transaction.date) {
      const exist = trans.transactions.filter(t => { if (t.date === transaction.date) return t })
      if (exist.length) {
        exist[0].operations.unshift(transaction)
      } else {
        trans.transactions.unshift({
          date: moment(transaction.date).format('YYYYMMDD'),
          operations: [transaction]
        })
      }
    }
  }

  return trans
}

const bind = (data) => {
  if (data.toString().indexOf('Error:') !== -1) {
    console.log('Error-serverless: ', data)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        errorMessage: data.toString().replace('Error:', '')
      })
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(data)
  }
}

async function sendNotification (user, title, description, link, data) {
  if (!user.push_ids || !user.push_ids.userId) return true

  axios.defaults.headers.common['Authorization'] = 'Basic MTE1ZWU2MWItNTgxYy00YjVhLWI0ZmEtMGMxOGRmYmUyMGM5'

  const notification = {
    app_id: appId,
    headings: { 'en': title },
    contents: { 'en': description },
    large_icon: 'https://static.wixstatic.com/media/06475e_17caa4a3e10b4abe86a3c39721b06afa~mv2.png',
    include_player_ids: [user.push_ids.userId]
  }

  if (link) {
    notification.url = link
  }

  if (data) {
    notification.data = data
  }

  await axios.post('https://onesignal.com/api/v1/notifications', notification)
}

async function replaceParams (script, params) {
  let newScript = script
  for (let i in params) {
    let iToReplace = i.replace(/\[/, '\\[')
    iToReplace = iToReplace.replace(/\]/, '\\]')
    newScript = newScript.replace(new RegExp(iToReplace, 'g'), params[i])
  }
  return newScript
}

async function sendAdmNotification (title, description, data) {
  return new Promise(async (resolve, reject) => {
    axios.defaults.headers.common['Authorization'] = 'Basic OTA1NDdjMDctNmU3Ny00YmMyLWE3MTgtZjU4ZDQ5YTJiMDE0'

    axios.post('https://onesignal.com/api/v1/notifications', {
      app_id: appIdAdmin,
      headings: { 'en': title },
      contents: { 'en': description },
      data: data || {},
      large_icon: 'https://raw.githubusercontent.com/fabiorogeriosj/tindin/master/icon.png',
      included_segments: ['All']
    })
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        console.log(error)
        resolve()
      })
  })
}

const sendPushNotification = async (user, push, data) => {
  if (!user.push_ids || !user.push_ids.userId) return false

  axios.defaults.headers.common['Authorization'] = 'Basic MTE1ZWU2MWItNTgxYy00YjVhLWI0ZmEtMGMxOGRmYmUyMGM5'

  const notification = {
    app_id: appId,
    headings: push.headings,
    contents: push.contents,
    large_icon: 'https://static.wixstatic.com/media/06475e_17caa4a3e10b4abe86a3c39721b06afa~mv2.png',
    include_player_ids: [user.push_ids.userId]
  }

  if (data) {
    notification.data = data
  }

  await axios.post('https://onesignal.com/api/v1/notifications', notification)
}

module.exports = {
  removeEmpty,
  formatTransactions,
  bind,
  sendNotification,
  replaceParams,
  sendAdmNotification,
  sendPushNotification
}
