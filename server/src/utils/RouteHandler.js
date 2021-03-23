class RouteHandler {
    constructor() {}
    route(callback) {
        return async (req, res, next) => {
            try {
                const result = await callback(req, res);
                if (typeof result !== 'undefined') {
                    res.json(result);
                }
            } catch (e) {
                next(e);
            }
        }
    }
    middleware(callback) {
        return async (req, res, next) => {
            try {
                await callback(req, res, next);
            } catch (e) {
                next(e);
            }
        }
    }
    error(err, req, res, next) {
        const {
            statusCode,
            message,
        } = err;
        if (err.name === 'TypeError') {
            res.status(501);
            return res.end();
        }
        res.status(statusCode || 500);
        return res.json({
            message,
            errors: err.errors || [],
        });
    }
}

module.exports = RouteHandler;
