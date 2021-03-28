const httpContext = require('express-http-context');


class Controller {
    constructor() {
        const { userID } = httpContext.get('AuthorizationContext') || { userID: undefined };
        this.userID = userID;
    }
}

module.exports = Controller;
