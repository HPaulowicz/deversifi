import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { message, Button, Typography, Space, Input, Spin, Form } from 'antd';
import { MenuOutlined, CloseOutlined, DownloadOutlined, PieChartTwoTone } from '@ant-design/icons';
import moment from 'moment';

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

    setUserID(userID: string | number) {
        this.setState({ userID });
    }

    renderUserOrders() {
        return (
            <></>
        );
    }

    renderOrderBook() {
        return (
            <></>
        );
    }

    renderOrderForm() {
        return (
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                </Button>
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
                <Space>
                    <Text strong>Order book:</Text>
                    {this.renderOrderBook()}
                </Space>
            </Space>
        );
    }
}

export default Home;
