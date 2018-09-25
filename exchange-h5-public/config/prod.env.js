'use strict'
let HOST = JSON.parse(process.env.npm_config_argv).original[3] || 'test';
module.exports = {
  NODE_ENV: '"production"',
  HOST: '"'+HOST+'"'
  // API_ROOT: '"http://staging.365os.com/contract-vue-api"'
}
