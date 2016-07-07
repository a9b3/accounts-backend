const path = require('path')

require('babel-register')({})
require('app-module-path').addPath(path.resolve(__dirname, 'src'))
require('./src')
