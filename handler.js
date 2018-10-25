'use strict'

const path = require('path')
const postsGet = require(path.join(__dirname, 'functions', 'posts'))

module.exports = {
  posts: (event, context) => {
    if (event.httpMethod === 'GET' && event.path === '/posts') return postsGet(event, context)
  }
}
