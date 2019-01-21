const debug = require('debug');

const error = debug('app:error');
const log = debug('app:log');

module.exports = { error, log };
