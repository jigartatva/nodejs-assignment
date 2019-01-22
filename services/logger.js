// For more readable, configurable logging
// https://github.com/visionmedia/debug#usage

const debug = require('debug');

const error = debug('app:error');
const log = debug('app:log');

module.exports = { error, log };
