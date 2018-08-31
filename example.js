const { ErrorCode } = require('./appError');
const { create: createServer } = require('./server');

module.exports = createServer({
    name: 'Example',
    routes: [],
    viewRoutes: [],
    ErrorCode
});
