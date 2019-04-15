const mongoose = require('mongoose');
const config = require('./config');

const connection = mongoose.createConnection(config.mongo, {useNewUrlParser: true});

module.exports = connection;