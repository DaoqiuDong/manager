var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.5.110:8080/credit-web/credit"'//丽
  // BASE_API: '"http://192.168.5.112:8080/credit-web/credit"'//林
  BASE_API: '"http://192.168.5.114:8080/credit-web/"'//李
})
