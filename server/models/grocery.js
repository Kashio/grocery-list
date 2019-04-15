const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const connection = require('../db');

const GrocerySchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        default: uuidv4,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, {_id: false});

GrocerySchema.statics.getUserGroceries = username => {
    return Grocery
        .find({username})
        .then(groceries => {
            return groceries.map(grocery => grocery._doc);
        });
};

GrocerySchema.statics.addGrocery = grocery => {
    return Grocery.create({_id: uuidv4(), ...grocery});
};

GrocerySchema.statics.deleteGrocery = grocery => {
    return Grocery.remove({_id: grocery._id});
};

const Grocery = connection.model('Grocery', GrocerySchema);

module.exports = Grocery;