const jwt = require('jsonwebtoken');
const config = require('../config');

const authentication = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, config.token.secret, (error, decoded) => {
            if (error) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.username = decoded.username;
                next();
            }
        });
    }
};

module.exports = authentication;