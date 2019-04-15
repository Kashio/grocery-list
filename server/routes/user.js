const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const protobuf = require('protobufjs');
const config = require('../config');
const protobufMessageParser = require('../middlewares/protobuf-message-parser');

const User = require('../models/user');

router.use(protobufMessageParser('user'));

router.post('/register', (req, res) => {
    User.register(req.user)
        .then(result => {
            protobuf.load(path.join(__dirname, '../../protos/grocery/api/response/register.proto'))
                .then(root => {
                    const RegisterResponseMessage = root.lookupType('grocery.api.response.RegisterResponse');
                    const message = RegisterResponseMessage.create({status: 1});
                    res.setHeader("Content-Type", "application/octet-stream");
                    res.write(RegisterResponseMessage.encode(message).finish());
                    res.end();
                })
                .catch(error => {
                    console.error(error);
                    process.exit(1);
                });
            // res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

router.post('/login', (req, res) => {
    User.login(req.user)
        .then(result => {
            const token = jwt.sign(user.username, config.token.secret, {
                expiresIn: config.token.expiration
            });
            res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

module.exports = router;