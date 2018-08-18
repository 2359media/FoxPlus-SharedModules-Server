const { ErrorCode } = require('./appError');
const { create: createServer } = require('./server');

module.exports = createServer('Example', [], { errorCode: ErrorCode });
