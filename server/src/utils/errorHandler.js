class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

class AuthenticationError extends Error {
    constructor(message = 'authentication_failed') {
        super(message);
        this.statusCode = 403;
    }
}

module.exports = {
    ValidationError,
    AuthenticationError,
}
