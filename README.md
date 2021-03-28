# DeversiFi
DeversiFi engineering assessment
## Running the app
Be sure you are using Node v.12^

    npm install && npm run start

That should install modules from the **./client** and **./server** folders, then run the server app and the web app.

Access the web app: http://localhost:8080/
___

## See `postman_collection.json`

___
`GET localhost:8000/getOrderbook`
Headers: 
`Authorization: {"userID": 1}`
Response:
```
{
    "asks": [
        {
            "price": 54562.19,
            "count": 2,
            "amount": 0.3,
            "total": 0.3
        }
    ],
    "bids": [
        {
            "price": 54535.95,
            "count": 1,
            "amount": 0.1,
            "total": 0.1
        }
    ]
}
```

`GET localhost:8000/getOrdersForUser`
Headers: 
`Authorization: {"userID": 1}`
Response:
```
[
    {
        "userID": 1,
        "amount": 0.1,
        "price": 54562,
        "side": "bid",
        "orderID": "M88Iswy-D"
    }
]
```

`GET localhost:8000/placeOrder`
Headers: 
`Authorization: {"userID": 1}`
Body:
```
{
	"side": "ask",
	"amount": 2.44,
	"price": 54562
}
```
Response:
```
{
    "orderID": "BN-9l3swr"
}
```

`GET localhost:8000/cancelOrder`
Headers: 
`Authorization: {"userID": 1}`
Body:
```
{
	"orderID": "BN-9l3swr"
}
```
Response:
```
{
    "status": true
}
```