const jwt = require('jsonwebtoken');
const UserPersonalInfoRepository = require('../../app/repository/user/user-personal-info-repository')
const auth = {
    authenticationToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const tokenReceived = authHeader && authHeader.split(' ')[1];
        if (tokenReceived === null || tokenReceived === undefined) {
            console.error(`${new Date()}==== AUTHENTICATION 401 THROWED ==========`);
            return res.status(401).send({message: 'Vous n\'êtes pas connecté'});
        }
        const token = tokenReceived.replace(/"/g, '');
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.error(`${new Date()}==== AUTHENTICATION 403 THROWED ==========`);
                return res.status(403).send({message: 'Action non autorisée'});
            }
            req.user = user;
            UserPersonalInfoRepository.getUserInfoByUserId(user.data.id).then((userInfo) => {
                req.user.data.userInfo = userInfo;
                next();
            }).catch((rejected) => {
                console.error(`${new Date()}==== FAILED TO getUserInfoByUserId WITH user : ${user.data.id} Error : ${rejected} ==========`);
                next();
            })
        })
    }
};

module.exports = auth;

