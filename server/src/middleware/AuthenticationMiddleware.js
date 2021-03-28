const httpContext = require('express-http-context');

const {
    AuthenticationError,
} = require('../utils/errorHandler');

class AuthenticationMiddleware {
    async authenticate(req, res, next) { 
        const { headers } = req;
        const { authorization } = headers;

        if (!authorization) {
            throw new AuthenticationError('Authorization header is required');
        }
        try {
            const { userID } = JSON.parse(authorization);
            httpContext.set('AuthorizationContext', { userID });
        } catch (e) {
            throw new AuthenticationError('Cant parse the authorization header');
        }
        next();
    }
}

module.exports = new AuthenticationMiddleware();
