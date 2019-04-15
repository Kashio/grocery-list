import React, {useContext, useReducer, useRef, useEffect} from 'react';
import './grocery-app.scss';
import {Redirect} from 'react-router';
import reducer from '../../reducers/groceries';
import types from '../../actions/groceries';
import useAuth from '../../hooks/useAuth';
import UserContext from '@/app/user.context';
import GroceryContext from './grocery-app.context';
import GroceryList from '@/grocery-list/grocery-list';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {toast} from 'react-toastify';
import GroceryApi from '../../api/grocery';
import Status from '../../api/status';

const INITIAL_STATE = {
    filter: '',
    items: []
};

const GroceryApp = () => {
    const [user, setUser] = useContext(UserContext);
    const redirect = useAuth(setUser);
    const [groceries, dispatch] = useReducer(reducer, INITIAL_STATE);
    const groceryNameRef = useRef();

    useEffect(() => {
        GroceryApi
            .list(user.username)
            .then(result => {
                if (result.status === Status.SUCCESS) {
                    dispatch({type: types.LOAD, payload: {items: result.groceries}});
                } else {
                    throw result.message
                }
            })
            .catch(error => {
                toast.error('failed to load your grocery list:\n' + error, {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                console.error(error);
            });
    }, [user.username]);

    const add = () => {
        if (groceryNameRef.current.value !== '') {
            GroceryApi
                .add(groceryNameRef.current.value, user.username)
                .then(result => {
                    if (result.status === Status.SUCCESS) {
                        dispatch({type: types.ADD, payload: {grocery: result.grocery}});
                        toast.success(groceryNameRef.current.value + ' added to your grocery list!', {
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                    } else {
                        throw result.message;
                    }
                })
                .catch(error => {
                    toast.error('failed to add ' + groceryNameRef.current.value + ' to your grocery list:\n' + error, {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                    console.error(error);
                });
        }
    };

    // NOTE: I use controlled component TextField to control the value of groceries.filter
    //       because most of the time other components want to know the filtered value
    //       so using inputRef with onChange event won't suffice for such future cases
    const filter = event => {
        dispatch({type: types.FILTER, payload: {filter: event.target.value}})
    };

    const filteredGroceries = () => {
        return groceries.items.filter(grocery => grocery.name.toLowerCase().includes(groceries.filter.toLowerCase()));
    };

    if (redirect) {
        return <Redirect to="/"/>;
    }
    return (
        <GroceryContext.Provider value={dispatch}>
            <Grid container
                  spacing={8}
                  align="center"
                  justify="center"
                  style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      padding: 10,
                      borderRadius: 5,
                      width: 300
                  }}
                  direction="column">
                <Typography>Hello {user.username}, here are your groceries</Typography>
                <Grid
                    container
                    spacing={8}
                    className="grocery-list-grid"
                    alignItems="flex-end">
                    <Grid item>
                        <GroceryList groceries={filteredGroceries()}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={8}
                    align="center"
                    justify="center">
                    <Grid item xs={12}>
                        <TextField
                            className="filter-grocery-name"
                            type="text"
                            label="Filter Grocery name"
                            value={groceries.filter}
                            onChange={filter}/>
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Button
                            variant="contained"
                            className="add-button"
                            style={{marginTop: 20}}
                            onClick={add}>
                            Add
                        </Button>
                    </Grid>
                    <Grid item>
                        <TextField
                            className="add-grocery-name"
                            type="text"
                            label="Grocery name"
                            inputRef={groceryNameRef}/>
                    </Grid>
                </Grid>
            </Grid>
        </GroceryContext.Provider>
    );
};

export default GroceryApp;