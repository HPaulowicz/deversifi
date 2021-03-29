import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { message, Button, Typography, Space, Input, Spin, Table, Tag, Popconfirm } from 'antd';

import './style.less';

const { Text } = Typography;
const { Search } = Input;

interface IOrderbook {
    asks: {
        price: number,
        count: number,
        amount: number,
        total: number,
    }[],
    bids: {
        price: number,
        count: number,
        amount: number,
        total: number,
    }[],
};

interface IPlaceOrderResponse {
    orderID: string,
};

interface ICancelOrderResponse {
    status: boolean,
};

interface IOrdersForUser {
    userID: number,
    amount: number,
    price: number,
    side: string,
    orderID: string,
};

interface IProps extends RouteComponentProps { };
interface IState {
    userID?: string | number,
    orderBookLoading: boolean,
    orderPlaceLoading: boolean,
    orderCancelLoading: boolean,
    userOrdersLoading: boolean,
    orderBook?: IOrderbook,
    userOrders: IOrdersForUser[],
    amount?: number | string,
    price?: number | string,
    side?: 'ask' | 'bid',
};

class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            userID: 1,
            orderBookLoading: false,
            orderPlaceLoading: false,
            orderCancelLoading: false,
            userOrdersLoading: false,
            orderBook: undefined,
            userOrders: [],
        };
    };

    componentDidMount() {
        this.loadOrderBook();
        this.loadUserOrders();
    }

    loadOrderBook() {
        const { userID } = this.state;
        this.setState({ orderBookLoading: true });
        fetch('http://localhost:8000/getOrderbook', {
            method: 'GET',
            headers: {
                'Authorization': JSON.stringify({ userID }),
            }
        }).then(res => res.json()).then(
            (result: IOrderbook) => {
                this.setState({
                    orderBookLoading: false,
                    orderBook: result,
                });
            },
            (error) => {
                this.setState({
                    orderBookLoading: false,
                });
                message.error(error);
            }
        );
    }

    loadUserOrders() {
        const { userID } = this.state;
        this.setState({ userOrdersLoading: true });
        fetch('http://localhost:8000/getOrdersForUser', {
            method: 'GET',
            headers: {
                'Authorization': JSON.stringify({ userID }),
            }
        }).then(res => res.json()).then(
            (result: IOrdersForUser[]) => {
                this.setState({
                    userOrdersLoading: false,
                    userOrders: result
                });
            },
            (error) => {
                this.setState({
                    userOrdersLoading: false,
                });
                message.error(error);
            }
        );
    }

    cancelOrder(orderID: string) {
        const { userID } = this.state;
        this.setState({ orderCancelLoading: true });

        fetch('http://localhost:8000/cancelOrder', {
            method: 'POST',
            headers: {
                'Authorization': JSON.stringify({ userID }),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderID }),
        }).then(res => res.json()).then(
            (result: ICancelOrderResponse) => {
                this.setState({
                    orderCancelLoading: false,
                });
                if (result && result.status) {
                    message.success(`Order ${orderID} have been cancelled`);
                    this.loadUserOrders();
                    this.loadOrderBook();
                }
            },
            (error) => {
                this.setState({
                    orderCancelLoading: false,
                });
                message.error(error);
            }
        );
    }

    placeOrder() {
        const { userID, amount, price, side } = this.state;
        this.setState({ orderPlaceLoading: true });

        fetch('http://localhost:8000/placeOrder', {
            method: 'POST',
            headers: {
                'Authorization': JSON.stringify({ userID }),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                side: side,
                amount: Number.parseFloat(amount as string),
                price: Number.parseFloat(price as string),
            }),
        }).then(res => res.json()).then(
            (result: IPlaceOrderResponse) => {
                this.setState({
                    orderPlaceLoading: false,
                });
                if (result && result.orderID) {
                    message.success(`Order ${result.orderID} have been placed`);
                    this.loadUserOrders();
                    this.loadOrderBook();
                }
            },
            (error) => {
                this.setState({
                    orderPlaceLoading: false,
                });
                message.error(error);
            }
        );
    }

    setUserID(userID: string | number) {
        this.setState({ userID });
    }

    prepareOrder(side: 'ask' | 'bid') {
        const { orderBook } = this.state;
        const firstRow = (side === 'ask') ? orderBook?.asks[0] : orderBook?.bids[0];
        const { amount, price } = firstRow || { amount: 0, price: 0 };
        this.setState({ amount, price, side });
    }

    renderUserOrders() {
        const { userOrders, userOrdersLoading, orderCancelLoading } = this.state;

        const columns = [{
            title: 'Order ID',
            dataIndex: 'orderID',
            key: 'orderID',
        }, {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        }, {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: 'Buy / Sell',
            dataIndex: 'side',
            key: 'side',
            render: (_: unknown, record: IOrdersForUser) => record.side === 'ask' ? <Tag color='#87d068'>BUY</Tag> : <Tag color='#f50'>SELL</Tag>,
        }, {
            title: 'Action',
            key: 'action',
            render: (_: unknown, record: IOrdersForUser) => (
                <Button
                    loading={orderCancelLoading}
                    danger
                    onClick={() => this.cancelOrder(record.orderID)}>
                    Cancel order
                </Button>
            ),
        }];
        return (
            <Table columns={columns} dataSource={userOrders} loading={userOrdersLoading} />
        );
    }

    renderOrderBook() {
        const { orderBookLoading, orderBook } = this.state;
        if (orderBookLoading) {
            return (<Spin></Spin>);
        }
        const orderBookMaxArrayLength = Math.max(orderBook?.asks.length || 0, orderBook?.bids.length || 0);
        const rows = Array(orderBookMaxArrayLength).fill(null).map((_, i) => {
            const ask = orderBook?.asks[i];
            const bid = orderBook?.bids[i];
            return (
                <div className='orderBookRow'>
                    <div className='ask'>{ask?.count || ''}</div>
                    <div className='ask'>{ask?.amount || ''}</div>
                    <div className='ask'>{ask?.total || ''}</div>
                    <div className='ask'>{ask?.price || ''}</div>

                    <div className='bid'>{bid?.price || ''}</div>
                    <div className='bid'>{bid?.total || ''}</div>
                    <div className='bid'>{bid?.amount || ''}</div>
                    <div className='bid'>{bid?.count || ''}</div>
                </div>
            )
        });
        return (
            <div className='orderBook'>
                <div className='orderBookRow header'>
                    <div>Count</div>
                    <div>Amount</div>
                    <div>Total</div>
                    <div>Price</div>

                    <div>Price</div>
                    <div>Total</div>
                    <div>Amount</div>
                    <div>Count</div>
                </div>
                {rows}
            </div>
        );
    }

    renderOrderForm() {
        return (
            <Input.Group compact>
                <Input style={{ width: 100, textAlign: 'center' }} placeholder="amount" value={this.state.amount} onChange={(e) => this.setState({ amount: e.currentTarget.value })} />
                <Input style={{ width: 100, textAlign: 'center' }} placeholder="price" value={this.state.price} onChange={(e) => this.setState({ price: e.currentTarget.value })} />
            </Input.Group>
        );
    }

    render() {
        const { userID } = this.state;

        return (
            <Space direction='vertical'>
                <Space>
                    <Text strong>User ID: {userID}</Text>
                    <Search placeholder='Set user ID (number)' onSearch={(userID) => this.setUserID(userID)} enterButton='Set ID' />
                </Space>
                <Space direction='vertical'>
                    <Text strong>User Orders:</Text>
                    {this.renderUserOrders()}
                </Space>
                <Space direction='horizontal'>
                    <Popconfirm
                        title={this.renderOrderForm()}
                        onConfirm={() => this.placeOrder()}
                        onCancel={() => this.setState({ amount: undefined, price: undefined, side: undefined })}
                        okText='Confirm'
                        cancelText='Cancel'
                    >
                        <Button type='primary' size='large' onClick={() => this.prepareOrder('ask')}>Buy</Button>
                        <Button type='primary' size='large' danger onClick={() => this.prepareOrder('bid')}>Sell</Button>
                    </Popconfirm>
                </Space>
                <Space direction='vertical'>
                    {this.renderOrderBook()}
                </Space>
            </Space>
        );
    }
}

export default Home;
