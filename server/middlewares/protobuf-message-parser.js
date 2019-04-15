const path = require('path');
const protobuf = require('protobufjs');

module.exports = name => {
    let Message;
    protobuf.load(path.join(__dirname, `../../protos/grocery/${name}.proto`))
        .then(root => {
            Message = root.lookupType(`grocery.${name.charAt(0).toUpperCase() + name.slice(1)}`);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
    return (req, res, next) => {
        req[name] = Message.decode(req.raw);
        const error = Message.verify(req[name]);
        if (error) {
            res.status(500).send(`Invalid ${name} payload`);
        } else {
            next();
        }
    };
};
