const { AuthorizationError } = require('./errors');
const { ac } = require('../config/accessControl');

const authorize = (role, resource, actions, condition) => {
    for (const action of actions) {
        const permission = ac.can(role)[action](resource);

        if (permission.granted) {
            if (action.endsWith('Own') && !condition) {
                throw new AuthorizationError('You do not have access');
            }
            return; // Authorized, no error thrown
        }
    }

    throw new AuthorizationError('You do not have access');
};

module.exports = authorize;
