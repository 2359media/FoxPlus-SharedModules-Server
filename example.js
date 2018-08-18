const { createServer, ErrorCode } = require('.');

module.exports = createServer('Example', [], { errorCode: ErrorCode });
