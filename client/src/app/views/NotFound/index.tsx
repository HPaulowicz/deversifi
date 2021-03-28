import React from 'react';
import { Empty } from 'antd';

class NotFound extends React.Component {
    render() {
        return (
            <Empty
                description={
                    <span>
                        Go to a <a href="/">Home page</a>
                    </span>
                }
            >
            </Empty>
        );
    }
}

export default NotFound;
