const parseAndClean = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') parseAndClean(obj[key])
    else if (obj[key] == null || obj[key] === '' || key.indexOf('$') !== -1) delete obj[key]
  })

  return obj
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

module.exports = {
  parseAndClean,
  bind
}
