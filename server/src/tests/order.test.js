const Order = require('../models/order/Order');
const DB =  require('../data/DB');

test('Orderbook should work correctly', () => {
    const orderbook = Order.getOrderBook();
    expect(orderbook).toHaveProperty('asks');
    expect(orderbook).toHaveProperty('bids');
    expect(orderbook.asks[0]).toHaveProperty('price');
    expect(orderbook.asks[0]).toHaveProperty('count');
    expect(orderbook.asks[0]).toHaveProperty('amount');
    expect(orderbook.asks[0]).toHaveProperty('total');
});

test('Order to be placed', () => {
    const response = Order.placeOrder(1, 3.14, 56200, 'ask');
    expect(response).toHaveProperty('orderID');
    expect(DB.orders).toEqual(expect.arrayContaining([{
        userID: 1, amount: 3.14, price: 56200, side: 'ask', orderID: response.orderID
    }]));
});


test('Order to be cancelled', () => {
    const responsePlace = Order.placeOrder(1, 3.14, 56200, 'ask');
    expect(responsePlace).toHaveProperty('orderID');
    expect(DB.orders).toEqual(expect.arrayContaining([{
        userID: 1, amount: 3.14, price: 56200, side: 'ask', orderID: responsePlace.orderID
    }]));
    const responseCancel = Order.cancelOrder(1, responsePlace.orderID);
    expect(responseCancel).toHaveProperty('status');
    expect(DB.orders).toEqual(expect.not.arrayContaining([{
        userID: 1, amount: 3.14, price: 56200, side: 'ask', orderID: responsePlace.orderID
    }]));
});

test('User orders should work correctly', () => {
    const responsePlace1 = Order.placeOrder(1, 3.14, 56200, 'ask');
    const responsePlace2 = Order.placeOrder(2, 3.14, 56200, 'ask');
    
    expect(DB.orders).toEqual(expect.arrayContaining([{
        userID: 1, amount: 3.14, price: 56200, side: 'ask', orderID: responsePlace1.orderID
    }, {
        userID: 2, amount: 3.14, price: 56200, side: 'ask', orderID: responsePlace2.orderID
    }]));

    const ordersForUser = Order.getOrdersForUser(1);
    expect(ordersForUser).toEqual(expect.arrayContaining([{
        userID: 1, amount: 3.14, price: 56200, side: 'ask', orderID: responsePlace1.orderID
    }]));
    expect(ordersForUser).toEqual(expect.not.arrayContaining([{
        userID: 2, amount: 3.14, price: 56200, side: 'ask', orderID: responsePlace2.orderID
    }]));
});
