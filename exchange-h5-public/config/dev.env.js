'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  // HOST:'"localhost"',
  NODE_ENV: '"development"'
})
