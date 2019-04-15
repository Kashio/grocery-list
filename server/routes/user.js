const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const protobuf = require('protobufjs');
const config = require('../config');
const protobufMessageParser = require('../middlewares/protobuf-message-parser');

const User = require('../models/user');

router.use(protobufMessageParser('user'));

let RegisterResponseMessage;
protobuf.load(path.join(__dirname, '../../protos/grocery/api/response/register.proto'))
    .then(root => {
        RegisterResponseMessage = root.lookupType('grocery.api.response.RegisterResponse');
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

let LoginResponseMessage;
protobuf.load(path.join(__dirname, '../../protos/grocery/api/response/login.proto'))
    .then(root => {
        LoginResponseMessage = root.lookupType('grocery.api.response.LoginResponse');
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

router.post('/register', (req, res) => {
    User.register(req.user)
        .then(result => {
            const message = RegisterResponseMessage.create({status: 1});
            res.setHeader("Content-Type", "application/octet-stream");
            res.write(RegisterResponseMessage.encode(message).finish());
            res.end();
        })
        .catch(error => {
            const message = RegisterResponseMessage.create({status: 2, message: error.message});
            res.setHeader("Content-Type", "application/octet-stream");
            res.write(RegisterResponseMessage.encode(message).finish());
            res.end();
        });
});

router.post('/login', (req, res) => {
    User.login(req.user)
        .then(result => {
            const token = jwt.sign({username: result.username}, config.token.secret, {
                expiresIn: config.token.expiration / 1000 / 60 / 60 + 'h'
            });
            const message = LoginResponseMessage.create({status: 1});
            res.setHeader("Content-Type", "application/octet-stream");
            res.cookie('token', token, { maxAge: config.token.expiration, httpOnly: true });
            res.write(LoginResponseMessage.encode(message).finish());
            res.end();
        })
        .catch(error => {
            const message = LoginResponseMessage.create({status: 2, message: error.message});
            res.setHeader("Content-Type", "application/octet-stream");
            res.write(LoginResponseMessage.encode(message).finish());
            res.end();
        });
});

module.exports = router;