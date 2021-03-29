import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { message, Button, Typography, Space, Input, Spin, Form, Table, Tag } from 'antd';
import { MenuOutlined, CloseOutlined, DownloadOutlined, PieChartTwoTone } from '@ant-design/icons';

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

interface ICancelOrder {
    orderID: string,
}

interface IPlacedOrder {
    side: "ask" | "bid",
    amount: number,
    price: number,
}

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
                    orderBook: result
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

    setUserID(userID: string | number) {
        this.setState({ userID });
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
            render: (_: unknown, record: IOrdersForUser) => record.side === 'ask' ? <Tag color='#f50'>ASK</Tag> : <Tag color='#87d068'>BID</Tag>,
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
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={()=> {}}
                onFinishFailed={()=> {}}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
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
                    <Button size='large' type='primary'>Buy</Button>
                    <Button size='large' type='primary' danger>Sell</Button>
                </Space>
                <Space direction='vertical'>
                    {this.renderOrderBook()}
                </Space>
            </Space>
        );
    }
}

export default Home;
