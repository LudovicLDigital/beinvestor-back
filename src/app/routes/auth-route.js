const authRouter = require('../../shared/config/router-configurator');
const ErrorHandler = require("../../shared/util/error-handler");
const PasswordCrypter = require("../../shared/util/password-crypter");
const UserRepository = require('../repository/user/user-repository');
const UserRolesRepository = require('../repository/roles/user-roles-repository');
const UserTokenRepository = require('../repository/user/user-token-repository');
const Auth = require("../../shared/middleware/auth-guard");
const Constants = require("../../shared/constants");
const Access = require("../../shared/middleware/role-guard");
const jwt = require('jsonwebtoken');
const TokenSaver = require("../../shared/util/token-saver");
/**
 * Use this endpoint to log an user with his credentials
 */
authRouter.route('/api/login')
    .post(function(req, res) {
        console.log(`====TRYING TO GET USER BY LOGIN REQUESTED : ${req.body.login}===`);
        UserRepository.getUserByLogin(req.body.login).then((userFound) => {
            if (userFound[0] && userFound[0] !== null ) {
                PasswordCrypter.comparePassword(userFound[0].password, req.body.password).then((match) => {
                    if (match) {
                        TokenSaver.generateAndSaveUserFoundToken(req, res, userFound[0])
                    } else {
                        ErrorHandler.errorHandler({type: Constants.UNAUTHORIZE, message: 'Mot de passe incorrect'}, res);
                    }
                }).catch((rejected) => {
                    console.log('REJECTED : ' + rejected);
                    ErrorHandler.errorHandler(rejected, res);
                });
            } else {
                ErrorHandler.errorHandler({message: 'Aucun login correspondant'}, res);
            }
        }).catch((err) => {
            console.log(`getUserByLogin HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });

/**
 * You this endPoint to recover a new Access-token with passed body token
 */
authRouter.route('/api/token')
    .post(function(req, res){
        console.log(`====TRYING TO REQUEST A NEW ACCESS TOKEN WITH REFRESH TOKEN===`);
        const refreshToken = req.body.token;
        if (refreshToken == null) return res.sendStatus(401);
        const token = refreshToken.replace(/"/g, '');
        UserTokenRepository.getTokenSaved(token).then((tokenFound) => {
            if( !tokenFound || tokenFound === null) return res.sendStatus(403);
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.sendStatus(403);
                const userFound = user.data;
                UserRolesRepository.getAllPassedUserRoles(userFound.id).then((userRoles) => {
                    userFound.roles = userRoles;
                    req.user = userFound;
                    const accessToken = TokenSaver.generateToken(userFound);
                    res.json({accessToken: accessToken})
                }).catch((error) => {
                    console.log('/token HAVE FAILED on getAllPassedUserRoles, error : ${err}');
                    ErrorHandler.errorHandler(error, res);
                })
            })
        }).catch((err) => {
            console.log(`/token HAVE FAILED on getTokenSaved, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to logout (delete the refresh token from database )
 */
authRouter.route('/api/logout')
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE, Constants.T_USER_TOKEN), function(req, res){
        console.log(`====TRYING TO LOGOUT WITH TOKEN DELETION===`);
        Auth.currentUser = null;
        const token = req.body.token.replace(/"/g, '');
        UserTokenRepository.deleteToken(token).then(() => {
            res.sendStatus(204)
        }).catch((err) => {
            console.log(`/logout HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = authRouter;