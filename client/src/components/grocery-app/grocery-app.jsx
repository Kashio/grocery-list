import React, {useContext, useReducer, useRef, useEffect} from 'react';
import './grocery-app.scss';
import reducer from '../../reducers/groceries';
import types from '../../actions/groceries';
import UserContext from '@/app/user.context';
import GroceryContext from './grocery-app.context';
import GroceryList from '@/grocery-list/grocery-list';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import GroceryApi from '../../api/grocery';
import Status from '../../api/status';

const INITIAL_STATE = {
    filter: '',
    items: []
};

const GroceryApp = () => {
    const [user, setUser] = useContext(UserContext);
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
                // TODO: use toast to notify on error here
                console.error(error);
            });
    }, [user.username]);

    const add = () => {
        GroceryApi
            .add(groceryNameRef.current.value, user.username)
            .then(result => {
                if (result.status === Status.SUCCESS) {
                    dispatch({type: types.ADD, payload: {grocery: result.grocery}});
                } else {
                    throw result.message;
                }
            })
            .catch(error => {
                // TODO: use toast to notify on error here
                console.error(error);
            });
    };

    const filter = e => {
        dispatch({type: types.FILTER, payload: {filter: e.target.value}})
    };

    const filteredGroceries = () => {
        return groceries.items.filter(grocery => grocery.name.includes(groceries.filter));
    };

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
                <Grid
                    container
                    spacing={8}
                    className="grocery-list-grid"
                    alignItems="flex-end">
                    <Grid item>
                        <GroceryList groceries={filteredGroceries()}/>
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