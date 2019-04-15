module.exports = {
    mongo: 'mongodb://localhost:27017/grocery-app', // TODO: should be ENV variable and not committed in production application
    token: {
        secret: 'N6v#a$xz%3dAbqr3Tu', // TODO: should be ENV variable and not committed in production application
        expiration: '1h'
    }
};