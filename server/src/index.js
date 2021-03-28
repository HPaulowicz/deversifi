const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const httpContext = require('express-http-context');

const RouteHandler = require('./utils/RouteHandler');
const OrderController = require('./controllers/OrderController');

const AuthenticationMiddleware = require('./middleware/AuthenticationMiddleware');

const app = express();
const routeHandler = new RouteHandler();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(httpContext.middleware);

app.use((req, res, next) => {
    httpContext.ns.bindEmitter(req);
    httpContext.ns.bindEmitter(res);
    next();
});

app.use(routeHandler.middleware(async (req, res, next) => await AuthenticationMiddleware.authenticate(req, res, next)));

/**
 * The back end should expose the following REST endpoints:
 * 
 * placeOrder : takes price / amount / side and user ID, returns an order ID
 * cancelOrder : takes order ID and user ID, returns result of cancel
 * getOrderbook : returns simple data structure of prices and volumes
 * getOrdersForUser  : takes user ID and returns order IDs that are currently on the orderbook
 */

app.post('/placeOrder', routeHandler.route((req, res) => new OrderController().placeOrder(req, res)));
app.post('/cancelOrder', routeHandler.route((req, res) => new OrderController().cancelOrder(req, res)));
app.get('/getOrderbook', routeHandler.route((req, res) => new OrderController().getOrderBook(req, res)));
app.get('/getOrdersForUser', routeHandler.route((req, res) => new OrderController().getOrdersForUser(req, res)));

/**
 * Error Handler
 */
app.use((err, req, res, next) => routeHandler.error(err, req, res, next));

const port = process.env.PORT || 8000;

app.listen(port, async () => {
    console.info('\x1b[33m%s\x1b[0m', `Server Listening on port ${port}`);
});
