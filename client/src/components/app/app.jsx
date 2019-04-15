import React, {useState} from 'react';
import './app.scss';
import {Route, Switch} from 'react-router';
import UserContext from './user.context';
import Grid from '@material-ui/core/Grid';
import Login from '@/login/login';
import GroceryApp from '@/grocery-app/grocery-app';

const INITIAL_USER_STATE = {
  username: null
};

const App = () => {
    const [user, setUser] = useState(INITIAL_USER_STATE);

    return (
        <div className="app">
            <UserContext.Provider value={[user, setUser]}>
                <Grid container
                      spacing={0}
                      align="center"
                      justify="center"
                      direction="column"
                      style={{height: "100%"}}>
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route path="/groceries" component={GroceryApp}/>
                    </Switch>
                </Grid>
            </UserContext.Provider>UserContext.Provider>
        </div>
    );
};

export default App;