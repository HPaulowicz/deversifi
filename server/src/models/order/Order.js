const data = require('../../data/btcusd.json');

class Order {
    static getOrderBook() {
        const { 
            result: {
                asks,
                bids,
            }
        } = data;

        /**
         * The result structure must have the following data:
         * 
         * Price - current market price - key.
         * Count - shows the number of orders by the price marked in the Price column.
         * Amount — the sum of all trader’s offers at this price.
         * Total — cumulative number of coins offered or requested to a specific price point.
         * 
         * Simpliest, maybe not the best, but quick solution:
         * 
         * Looping from the last element till the first (right to left, asks then bids array).
         * From the current array element reading the price and amount.
         * Adding a key equals to price to the object, if the key does not exist, OR
         * accessing the object key (price) and summing up the count, amount and total.
         * 
         * After the asks / bids array is over, looping over the structure to sort
         * and calculate the Total.
         * 
         * Should be not bad, but I would be more than happy to explore other,
         * more efficient possibilities.
         */
        const calc = (array) => {
            const tmp = {};
            for (let i = 0; i < array.length; i += 1) {
                const [ price, amount ] = array[i];
                if (typeof tmp[price] === 'undefined') {
                    tmp[price] = {
                        price,
                        count: 0,
                        amount: 0,
                    };
                }
                tmp[price].count += 1;
                tmp[price].amount += amount;
            }
            const sorted = Object.values(tmp).sort((a, b) => b.price - a.price);
            const result = []; 
            for (let i = 0; i < sorted.length; i += 1) {
                const { price, count, amount } = sorted[i];
                if (i === 0) {
                    result.push({ price, count, amount, total: amount });
                    continue;
                }
                result.push({ price, count, amount, total: amount + result[i - 1].total });
            }
            return result;
        };

        const structure = {
            asks: calc(asks),
            bids: calc(bids),
        };
        
        return structure;
    }
}

module.exports = Order;
