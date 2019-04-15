module.exports = (req, res, next) => {
    if (!req.is('application/octet-stream')) {
        return next();
    }
    let data = [];
    req.on('data', chunk => {
        // TODO: figure why chunk is padded to 8192 bytes so we don't need to replace null bytes in the end - probably node.js bug ?
        data.push(chunk);
    });
    req.on('end', () => {
        if (data.length <= 0) {
            next();
        }
        data = Buffer.concat(data);
        req.raw = Buffer.from(data.toString().replace(/\0/g, ''));
        next();
    });
};