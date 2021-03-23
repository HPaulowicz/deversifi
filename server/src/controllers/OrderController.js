const Order = require('../models/order/Order')

class OrderController {
    static async getOrderBook(req, res) {
        return Order.getOrderBook();
    }
    
}

module.exports = OrderController;
