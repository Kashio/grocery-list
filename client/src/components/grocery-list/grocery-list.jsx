import React from 'react';
import './grocery-list.scss';
import GroceryItem from '@/grocery-item/grocery-item';

const GroceryList = ({groceries}) => {
    return (
        <div className="grocery-list">
            {
                groceries.map(grocery => <GroceryItem key={grocery._id} {...grocery} />)
            }
        </div>
    );
};
export default GroceryList;