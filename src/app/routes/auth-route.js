const authRouter = require('../../shared/config/router-configurator');
const ErrorHandler = require("../../shared/util/error-handler");
const PasswordCrypter = require("../../shared/util/password-crypter");
const UserRepository = require('../repository/user/user-repository');
const UserRolesRepository = require('../repository/roles/user-roles-repository');
const UserTokenRepository = require('../repository/user/user-token-repository');
const Auth = require("../../shared/middleware/auth-guard");

const jwt = require('jsonwebtoken');
/**
 * Use this endpoint to log an user with his credentials
 */
authRouter.route('/api/login')
    .post(function(req, res) {
        console.log(`====TRYING TO GET USER BY LOGIN REQUESTED : ${req.body.login}===`);
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

/**
 * Generate or update the user refresh token in database which will be logged
 * @param req http request parameters
 * @param res http response object
 * @param userFound the user recovered with the passed password and login
 */
function generateAndSaveUserFoundToken(req, res, userFound) {
    UserRolesRepository.getAllPassedUserRoles(userFound.id).then((userRoles) => {
        userFound.roles = userRoles;
        const accessToken = generateToken(userFound);
        const refreshToken = jwt.sign({data: userFound}, process.env.REFRESH_TOKEN_SECRET);
        console.log(`====TRYING TO CREATE A NEW TOKEN WITH USER ID : ${userFound.id}===`);
        Auth.currentUser = userFound;
        UserTokenRepository.createToken(userFound.id, refreshToken).then(() => {
            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        }).catch((err) => {
            if (err && err.constraint === 'userId_is_unique') {
                console.log(`====USERID EXISTING IN DB, TRYING TO UPDATE TOKEN NOW===`);
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
    }).catch((err) => {
        console.log(`getAllPassedUserRoles HAVE FAILED`);
        ErrorHandler.errorHandler(err, res);
    });
}

/**
 * You this endPoint to recover a new Access-token with passed body token
 */
authRouter.post('/token', (req, res) => {
    console.log(`====TRYING TO REQUEST A NEW ACCESS TOKEN WITH REFRESH TOKEN===`);
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
/**
 * EndPoint to logout (delete the refresh token from database )
 */
authRouter.delete('/logout', (req, res) => {
    console.log(`====TRYING TO LOGOUT WITH TOKEN DELETION===`);
    Auth.currentUser = null;
    UserTokenRepository.deleteToken(req.body.token).then(() => {
        res.sendStatus(200)
    }).catch((err) => {
        console.log(`/logout HAVE FAILED`);
        ErrorHandler.errorHandler(err, res);
    });
});
function generateToken(user) {
    return jwt.sign({data: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3600s'})
}
module.exports = authRouter;