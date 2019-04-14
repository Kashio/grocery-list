import React from 'react';
import './app.scss';
import { Route, Switch } from 'react-router';
import Login from '@/login/login';
import GroceryApp from '@/grocery-app/grocery-app';

const App = () => {
    return (
        <div className="app">
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/groceries" component={GroceryApp} />
            </Switch>
        </div>
    );
};

export default App;