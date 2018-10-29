'use strict'

const path = require('path')
const postsGet = require(path.join(__dirname, 'functions', 'posts'))
const postsSave = require(path.join(__dirname, 'functions', 'posts_save'))
const postsDelete = require(path.join(__dirname, 'functions', 'posts_delete'))
const postsSaveDraft = require(path.join(__dirname, 'functions', 'posts_draft'))
const contributorsGet = require(path.join(__dirname, 'functions', 'contributors'))
const postsTags = require(path.join(__dirname, 'functions', 'tags'))
const postsTagsSave = require(path.join(__dirname, 'functions', 'tags_save'))
const postsLoad = require(path.join(__dirname, 'functions', 'tags_load'))

module.exports = {
  posts: (event, context) => {
    if (event.httpMethod === 'GET' && event.path === '/posts') return postsGet(event, context)
    if (event.httpMethod === 'POST' && event.path === '/posts') return postsSave(event, context)
    if (event.httpMethod === 'DELETE' && event.path === '/posts') return postsDelete(event, context)
    if (event.httpMethod === 'POST' && event.path === '/posts/draft') return postsSaveDraft(event, context)
    if (event.httpMethod === 'GET' && event.path === '/posts/tags') return postsTags(event, context)
    if (event.httpMethod === 'POST' && event.path === '/posts/tags') return postsTagsSave(event, context)
    if (event.httpMethod === 'POST' && event.path === '/posts/load') return postsLoad(event, context)
  },
  contributors: (event, context) => {
    if (event.httpMethod === 'GET' && event.path === '/contributors') return contributorsGet(event, context)
  }
}
