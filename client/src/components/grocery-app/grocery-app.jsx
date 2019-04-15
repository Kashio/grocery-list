import React, {useContext, useReducer, useEffect} from 'react';
import './grocery-app.scss';
import reducer from '../../reducers/groceries';
import types from '../../actions/groceries';
import UserContext from '@/app/user.context';
import GroceryContext from './grocery-app.context';
import GroceryList from '@/grocery-list/grocery-list';
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

    useEffect(() => {
        GroceryApi
            .list(user.username)
            .then(result => {
                if (result.status === Status.SUCCESS) {
                    dispatch({type: types.LOAD, payload: {items: result.groceries}});
                } else {
                    throw new Error(result.status)
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, [user.username]);

    const add = () => {
        dispatch({type: types.ADD});
    };

    const filter = e => {
        dispatch({type: types.FILTER, payload: {filter: e.target.value}})
    };

    const filteredGroceries = () => {
        return groceries.items.filter(grocery => grocery.name.includes(groceries.filter));
    };

    return (
        <GroceryContext.Provider value={dispatch}>
            <GroceryList groceries={filteredGroceries()}/>
            <Button
                variant="contained"
                className="add-button"
                style={{marginTop: 20}}
                onClick={add}>
                Add
            </Button>
            <TextField
                className="add-grocery-name"
                type="text"
                label="Grocery name"
                value={groceries.filter}
                onChange={filter}/>
        </GroceryContext.Provider>
    );
};

export default GroceryApp;