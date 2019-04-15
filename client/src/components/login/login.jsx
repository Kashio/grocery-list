import React, {useContext, useState, useRef, useEffect, useCallback} from 'react';
import './login.scss';
import UserContext from '@/app/user.context';
import useReactRouter from 'use-react-router';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKey from '@material-ui/icons/VpnKey';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import UserApi from '../../api/user';
import Status from '../../api/status';

const INITIAL_REDIRECT_COUNTER = 6;

const Login = () => {
    const [user, setUser] = useContext(UserContext);
    const {history, location, match} = useReactRouter();
    const [redirectCounter, setRedirectCounter] = useState(INITIAL_REDIRECT_COUNTER);
    const [message, setMessage] = useState(null);
    const usernameRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        if (redirectCounter === 0) {
            login();
        } else if (redirectCounter !== INITIAL_REDIRECT_COUNTER) {
            redirect();
        }
    }, [redirectCounter]);

    const redirect = () => {
        setTimeout(() => {
            setRedirectCounter(redirectCounter - 1);
        }, 1000)
    };

    const register = () => {
        UserApi
            .register(usernameRef.current.value, passwordRef.current.value)
            .then(result => {
                if (result.status === Status.SUCCESS) {
                    redirect();
                } else {
                    throw result.message;
                }
            })
            .catch(error => {
                setMessage(error);
                console.error(error);
            });
    };

    const loginOnEnter = event => {
      if (event.key === 'Enter' && usernameRef.current.value !== '' && passwordRef.current.value !== '') {
          login();
      }
    };

    const login = () => {
        UserApi
            .login(usernameRef.current.value, passwordRef.current.value)
            .then(result => {
                if (result.status === Status.SUCCESS) {
                    setUser({username: usernameRef.current.value});
                    history.push('groceries');
                } else {
                    throw result.message;
                }
            })
            .catch(error => {
                setMessage(error);
                console.error(error);
            });
    };

    const renderMessage = useCallback(() => {
        if (redirectCounter < INITIAL_REDIRECT_COUNTER) {
            return 'Login in ' + redirectCounter + ' seconds...';
        }
        return message;
    }, [redirectCounter, message]);

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
                            autoFocus
                            error={message}
                            onKeyPress={loginOnEnter}
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
                            error={message}
                            onKeyPress={loginOnEnter}
                            required={true}
                            inputRef={passwordRef}/>
                    </Grid>
                </Grid>
            </Grid>
            <pre className="message">{renderMessage()}</pre>
            <Button
                variant="contained"
                className="login-button"
                style={{marginTop: 20, float: 'left'}}
                onClick={login}>
                Login
            </Button>
            <Button
                variant="contained"
                className="register-button"
                style={{marginTop: 20, float: 'right'}}
                onClick={register}>
                Register
            </Button>
        </div>
    );
};

export default Login;