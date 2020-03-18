const jwt = require('jsonwebtoken')
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const tokenReceived = authHeader && authHeader.split(' ')[1];
    if (tokenReceived === null || tokenReceived === undefined) {
        return res.sendStatus(401);
    }
    jwt.verify(tokenReceived, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
module.exports = authenticateToken;

