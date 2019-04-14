import React, {useReducer} from 'react';
import './login.scss';
import reducer from '../../reducers/user';
import types from '../../actions/user';
import useReactRouter from 'use-react-router';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const INITIAL_STATE = {
    username: '',
    password: ''
};

const Login = () => {
    const { history, location, match } = useReactRouter();
    const [user, dispatch] = useReducer(reducer, INITIAL_STATE);

    const setUsername = event => {
        dispatch({type: types.SET_USERNAME, payload: {username: event.target.value}});
    };

    const setPassword = event => {
        dispatch({type: types.SET_PASSWORD, payload: {password: event.target.value}});
    };

    const login = () => {
        history.push('groceries');
    };

    return (
        <div className="login">
            <TextField
                className="username"
                label="Username"
                value={user.username}
                onChange={setUsername}
                margin="normal"
            />
            <TextField
                className="password"
                label="Password"
                value={user.password}
                onChange={setPassword}
                margin="normal"
            />
            <Button variant="contained" className="login-button" onClick={login}>
                Login
            </Button>
        </div>
    );
};

export default Login;