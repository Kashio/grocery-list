import React, {useRef} from 'react';
import './login.scss';
import useReactRouter from 'use-react-router';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKey from '@material-ui/icons/VpnKey';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import UserApi from '../../api/user';
import Status from '../../api/status';

const Login = () => {
    const {history, location, match} = useReactRouter();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const login = () => {
        UserApi
            .register(usernameRef.current.value, passwordRef.current.value)
            .then(result => {
                if (result === Status.SUCCESS) {
                    history.push('groceries');
                } else {
                    throw new Error(result)
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className="login">
            <Grid container
                  spacing={8}
                  align="center"
                  justify="center"
                  style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      padding: 10,
                      borderRadius: 5
                  }}
                  direction="column">
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <AccountCircle/>
                    </Grid>
                    <Grid item>
                        <TextField
                            className="username"
                            type="text"
                            label="Username"
                            required={true}
                            inputRef={usernameRef}/>
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <VpnKey/>
                    </Grid>
                    <Grid item>
                        <TextField
                            className="password"
                            type="password"
                            label="Password"
                            required={true}
                            inputRef={passwordRef}/>
                    </Grid>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                className="login-button"
                style={{marginTop: 20}}
                onClick={login}>
                Login
            </Button>
        </div>
    );
};

export default Login;