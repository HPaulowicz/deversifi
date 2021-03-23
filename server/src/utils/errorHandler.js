
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(message = 'not_found') {
        super(message);
        this.statusCode = 404;
    }
}

class NotAllowedError extends Error {
    constructor(message = 'not_allowed') {
        super(message);
        this.statusCode = 405;
    }
}

module.exports = {
    ValidationError,
    NotFoundError,
    NotAllowedError,
}
