const jwt = require('jsonwebtoken');
const auth = {
    authenticationToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const tokenReceived = authHeader && authHeader.split(' ')[1];
        if (tokenReceived === null || tokenReceived === undefined) {
            return res.status(401).send({message: 'Vous n\'êtes pas connecté'});
        }
        jwt.verify(tokenReceived, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).send({message: 'Action non autorisée'});
            req.user = user;
            next()
        })
    }
};

module.exports = auth;

