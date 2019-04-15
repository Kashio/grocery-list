import React from 'react';
import './app.scss';
import {Route, Switch} from 'react-router';
import Grid from '@material-ui/core/Grid';
import Login from '@/login/login';
import GroceryApp from '@/grocery-app/grocery-app';

const App = () => {
    return (
        <div className="app">
            <Grid container
                  spacing={0}
                  align="center"
                  justify="center"
                  direction="column"
                  style={{ height: "100%" }}>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/groceries" component={GroceryApp}/>
                </Switch>
            </Grid>
        </div>
    );
};

export default App;