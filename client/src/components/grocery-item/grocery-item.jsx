import React, {useContext} from 'react';
import './grocery-item.scss';
import types from '../../actions/groceries';
import GroceryContext from '@/grocery-app/grocery-app.context';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const GroceryItem = ({_id, name, username}) => {
    const dispatch = useContext(GroceryContext);

    const remove = () => {
        dispatch({type: types.DELETE, payload: {_id}});
    };

    return (
        <div className="grocery-item">
            <TextField
                className="grocery-name"
                type="text"
                label="Grocery name"
                disabled={true}
                value={name}/>
            <Button
                variant="contained"
                className="add-button"
                onClick={remove}>
                Delete
            </Button>
        </div>
    );
};

export default React.memo(GroceryItem);