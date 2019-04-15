const express = require('express');
const router = express.Router();
const path = require('path');
const protobuf = require('protobufjs');
const protobufMessageParser = require('../middlewares/protobuf-message-parser');

const Grocery = require('../models/grocery');

router.use(protobufMessageParser('grocery'));

let GroceryMessage;
let GroceryListResponseMessage;
let GroceryAddResponseMessage;

protobuf.load(path.join(__dirname, '../../protos/grocery/grocery.proto'))
    .then(root => {
        GroceryMessage = root.lookupType('grocery.Grocery');
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
protobuf.load(path.join(__dirname, '../../protos/grocery/api/response/grocery-list.proto'))
    .then(root => {
        GroceryListResponseMessage = root.lookupType('grocery.api.response.GroceryListResponse');
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
protobuf.load(path.join(__dirname, '../../protos/grocery/api/response/grocery-add.proto'))
    .then(root => {
        GroceryAddResponseMessage = root.lookupType('grocery.api.response.GroceryAddResponse');
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

router.get('/', (req, res) => {
    Grocery.getUserGroceries(req.query.username)
        .then(result => {
            const groceries = result.map(grocery => GroceryMessage.create(grocery));
            const message = GroceryListResponseMessage.create({status: 1, groceries});
            res.setHeader("Content-Type", "application/octet-stream");
            res.write(GroceryListResponseMessage.encode(message).finish());
            res.end();
        })
        .catch(error => {
            const message = GroceryListResponseMessage.create({status: 2, message: error.message});
            res.setHeader("Content-Type", "application/octet-stream");
            res.write(GroceryListResponseMessage.encode(message).finish());
            res.end();
        });
});

router.post('/', (req, res) => {
    Grocery.addGrocery(req.grocery)
        .then(result => {
            const message = GroceryAddResponseMessage.create({status: 1, grocery: result._doc});
            res.setHeader("Content-Type", "application/octet-stream");
            res.write(GroceryAddResponseMessage.encode(message).finish());
            res.end();
        })
        .catch(error => {
            const message = GroceryAddResponseMessage.create({status: 2, message: error.message});
            res.setHeader("Content-Type", "application/octet-stream");
            res.write(GroceryAddResponseMessage.encode(message).finish());
            res.end();
        });
});

module.exports = router;