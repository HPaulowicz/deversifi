const Controller = require('./Controller');
const { ValidationError } = require('../utils/errorHandler');
const Order = require('../models/order/Order')


class OrderController extends Controller {
    constructor() {
        super();
    }
    async getOrderBook() {
        return Order.getOrderBook();
    }
    async getOrdersForUser() {
        return Order.getOrdersForUser(this.userID);
    }
    async placeOrder(req, res) {
        const {
            amount,
            price,
            side,
        } = req.body;
        if (!amount || !price || !side) {
            throw new ValidationError('required_fields');
        }
        if (!['ask', 'bid'].includes(side)) {
            throw new ValidationError('ask_bid_allowed');
        }
        return Order.placeOrder(this.userID, amount, price, side);
    }
    async cancelOrder(req, res) {
        const { orderID } = req.body;
        return Order.cancelOrder(this.userID, orderID);
    }
}

module.exports = OrderController;
