const express = require('express');
const router = express.Router();
const path = require('path');
const protobuf = require('protobufjs');

let AuthResponseMessage;
protobuf.load(path.join(__dirname, '../../protos/grocery/api/response/auth.proto'))
    .then(root => {
        AuthResponseMessage = root.lookupType('grocery.api.response.AuthResponse');
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

router.get('/', (req, res) => {
    const message = AuthResponseMessage.create({status: 1, username: req.username});
    res.setHeader("Content-Type", "application/octet-stream");
    res.write(AuthResponseMessage.encode(message).finish());
    res.end();
});

module.exports = router;