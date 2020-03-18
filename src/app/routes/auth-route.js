const authRouter = require('../../shared/config/router-configurator');
const ErrorHandler = require("../../shared/util/error-handler");
const PasswordCrypter = require("../../shared/util/password-crypter");
const UserRepository = require('../repository/user-repository');
const UserTokenRepository = require('../repository/user-token-repository');
const jwt = require('jsonwebtoken');
authRouter.route('/login')
    .post(function(req, res) {
        console.log('===TRYING TO GET USER BY LOGIN REQUESTED===');
        UserRepository.getUserByLogin(req.body.login).then((userFound) => {
            if (userFound[0] && userFound[0] !== null ) {
                if (PasswordCrypter.comparePassword(userFound[0].password, req.body.password)) {
                    generateAndSaveUserFoundToken(req, res, userFound[0])
                } else {
                    res.sendStatus(401);
                }
            }
        }).catch((err) => {
            console.log(`getUserByLogin HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
        });

function generateAndSaveUserFoundToken(req, res, userFound) {
    const accessToken = generateToken(userFound.id);
    const refreshToken = jwt.sign({date: userFound.id}, process.env.REFRESH_TOKEN_SECRET);
    console.log('===TRYING TO CREATE A NEW TOKEN WITH USER ID===');
    UserTokenRepository.createToken(userFound.id, refreshToken).then(() => {
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
    }).catch((err) => {
        if (err && err.constraint === 'userId_is_unique') {
            console.log('===USERID EXISTING IN DB, TRYING TO UPDATE TOKEN NOW===');
            UserTokenRepository.updateToken(userFound.id, refreshToken).then(() => {
                res.json({ accessToken: accessToken, refreshToken: refreshToken })
            }).catch((err) => {
                console.log(`updateToken HAVE FAILED`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.log(`/login HAVE FAILED to createToken in db`);
            ErrorHandler.errorHandler(err, res);
        }
    });
}
authRouter.post('/token', (req, res) => {
    console.log('===TRYING TO REQUEST A NEW ACCESS TOKEN WITH REFRESH TOKEN===');
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    UserTokenRepository.getTokenSaved(refreshToken).then((tokenFound) => {
        if( !tokenFound || tokenFound === null) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateToken(user.id);
            res.json({ accessToken: accessToken })
        })
    }).catch((err) => {
        console.log(`/token HAVE FAILED on getTokenSaved`);
        ErrorHandler.errorHandler(err, res);
    });
});

authRouter.delete('/logout', (req, res) => {
    console.log('===TRYING TO LOGOUT WITH TOKEN DELETION===');
    UserTokenRepository.deleteToken(req.body.token).then(() => {
        res.sendStatus(204)
    }).catch((err) => {
        console.log(`/logout HAVE FAILED`);
        ErrorHandler.errorHandler(err, res);
    });
});
function generateToken(userId) {
    return jwt.sign({data: userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3600s'})
}
module.exports = authRouter;