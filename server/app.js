const express = require('express');
const protobufParser = require('./middlewares/protobuf-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('./db');

const app = express();

app.use(protobufParser);
app.use(cookieParser());
app.use(cors());

app.use('/user', require('./routes/user'));

const authentication = require('./middlewares/authentication');

app.use('/grocery', authentication, require('./routes/grocery'));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        console.log('error url: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
        console.log('error: ' + err.message + '\n' + err);
        res.status(err.status || 500).send(err.message + '\n' + err);
    });
}

// Production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    console.log('error: ' + err.message);
    res.status(err.status || 500).send(err.message);
});

module.exports = app;