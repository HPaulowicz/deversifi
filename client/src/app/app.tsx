import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';

import NotFound from './views/NotFound';
import Home from './views/Home';

class App extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default withRouter(App);
