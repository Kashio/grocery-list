import React, {useContext} from 'react';
import './grocery-item.scss';
import types from '../../actions/groceries';
import GroceryContext from '@/grocery-app/grocery-app.context';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import GroceryApi from '../../api/grocery';
import Status from '../../api/status';
import {toast} from "react-toastify/index";

const GroceryItem = grocery => {
    const dispatch = useContext(GroceryContext);

    const remove = () => {
        GroceryApi
            .remove(grocery)
            .then(result => {
                if (result.status === Status.SUCCESS) {
                    dispatch({type: types.DELETE, payload: {_id: grocery._id}});
                    toast.success(grocery.name + ' deleted from your grocery list!', {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                } else {
                    throw result.message
                }
            })
            .catch(error => {
                toast.error('failed to delete ' + grocery.name + ' from your grocery list:\n' + error, {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                console.error(error);
            });
    };

    return (
        <div className="grocery-item">
            <Grid container
                  spacing={8}
                  alignItems="flex-end">
                <Grid item style={{margin: 'auto'}}>
                    <DeleteIcon className="delete-grocery-button pointer" onClick={remove}/>
                </Grid>
                <Grid item>
                    <TextField
                        className="grocery-name"
                        type="text"
                        defaultValue={grocery.name}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"/>
                </Grid>
            </Grid>
        </div>
    );
};

export default React.memo(GroceryItem);