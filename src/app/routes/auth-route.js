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
const MailSender = require("../../shared/util/mail-sender");
const crypto = require('crypto');
/**
 * Use this endpoint to log an user with his credentials
 */
authRouter.route('/api/login')
    .post(function(req, res) {
        console.log(`====TRYING TO GET USER BY LOGIN REQUESTED : ${req.body.login}===`);
        UserRepository.getUserByLogin(req.body.login).then((userFound) => {
            if (userFound && userFound !== null ) {
                PasswordCrypter.comparePassword(userFound.password, req.body.password).then((match) => {
                    if (match) {
                        TokenSaver.generateAndSaveUserFoundToken(req, res, userFound)
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
/**
 * EndPoint to subscribe user
 */
authRouter.route('/api/subscribe')
    .post(function(req, res) {
        console.log(`==========NEW USER: ${req.body.login} TRY TO SUBSCRIBE=============`);
        const user = {
            login: req.body.login,
            password: req.body.password,
            mail: req.body.mail,
            phone: req.body.phone
        };
        user.userInfo = req.body.userInfo ? req.body.userInfo : null;
        UserRepository.getUserByLogin(user.login).then(() => {
            console.log('====== PROCESS SUBSCRIBE ENDED WITH A 400=====');
            res.status(400).send({message: 'Identifiant déjà existant'});
        }).catch((err) => {
            if (err && err.statusCode === 404) {
                crypto.randomBytes(5, function (err, buf) {
                    // Ensure the activation code is unique.
                    user.activationCode = buf.toString('hex');
                    UserRepository.createUser(user).then((userCreated) => {
                        const link = 'beinvestorfranceapp://account/active/' + user.activationCode;
                        const userName = (user.userInfo && user.userInfo.firstName) ? user.userInfo.firstName: user.login;
                        const mailSubject = userName + ', activer votre compte BeInvestor !';
                        MailSender.sendAnAppMail(user.mail, mailSubject, Constants.MAIL_ACCOUNT_ACTIVATION_REQUIRED,
                            {
                                name: userName,
                                subject: mailSubject,
                                code: user.activationCode,
                                activationLink: link,
                            });
                        console.log('====== PROCESS SUBSCRIBE ENDED =====');
                        res.json(userCreated);
                    }).catch((err) => {
                        console.log(`/subscribe createUser HAVE FAILED, error : ${err}`);
                        ErrorHandler.errorHandler(err, res);
                    });
                })
            } else {
                console.log(`/subscribe getUserByLogin HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            }
        })
    });
authRouter.route('/api/activate')
    .post(function(req, res) {
        console.log(`==========TRY TO ACTIVATE ACCOUNT WITH KEY : ${req.body.activationCode}=============`);
        if (req.body.activationCode) {
            UserRepository.getUserByActivationKey(req.body.activationCode).then((user) => {
                if (user) {
                    if (user.mail === req.body.mail) {
                        UserRepository.activateUserAccount(user).then((userActivated) => {
                            res.status(200).json(userActivated);
                            console.log('====== PROCESS ACTIVATE ENDED =====');
                        }).catch((err) => {
                            console.log(`/activate activateUserAccount HAVE FAILED, error : ${err}`);
                            ErrorHandler.errorHandler(err, res);
                        })
                    } else {
                        console.log('====== PROCESS ACTIVATE ENDED WITH A 403 =====');
                        res.status(403).send({message: 'Le mail ne correspond pas'})
                    }
                } else {
                    console.log('====== PROCESS ACTIVATE ENDED WITH A 404 =====');
                    res.status(404).send({message: 'Pas d\'utilisateur avec cette clé'})
                }
            }).catch((err) => {
                console.log(`/activate getUserByActivationKey HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.log('====== PROCESS ACTIVATE ENDED WITH A 400 =====');
            res.status(400).send({message: 'Pas de clé d\'activation passée'});
        }
    });

authRouter.route('/api/resend-activate')
    .post(function(req, res) {
        console.log(`==========TRY TO RESEND ACTIVATION CODE FOR : ${req.body.mail}=============`);
        if (req.body.mail) {
            UserRepository.getUserByMail(req.body.mail).then((user) => {
                if (user) {
                    crypto.randomBytes(5, function (err, buf) {
                        user.activationCode = buf.toString('hex');
                        UserRepository.updateActivationKey(user);
                        const link = 'beinvestorfranceapp://account/active/' + user.activationCode;
                        const userName = (user.userInfo && user.userInfo.firstName) ? user.userInfo.firstName : user.login;
                        const mailSubject = userName + ', activer votre compte BeInvestor !';
                        MailSender.sendAnAppMail(user.mail, mailSubject, Constants.MAIL_ACCOUNT_ACTIVATION_REQUIRED,
                            {
                                name: userName,
                                subject: mailSubject,
                                code: user.activationCode,
                                activationLink: link,
                            });
                        console.log('====== PROCESS RESEND ACTIVATION CODE  ENDED =====');
                        res.sendStatus(202);
                    });
                } else {
                    console.log('====== PROCESS RESEND ACTIVATION CODE  ENDED WITH A 404 =====');
                    res.status(404).send({message: 'Aucun utilisateur trouvé avec cet email'})
                }
            }).catch((err) => {
                console.log(`/resend-activate getUserByMail HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.log('====== PROCESS RESEND ACTIVATION CODE  ENDED WITH A 400 =====');
            res.status(400).send({message: 'Aucun email transmis'});
        }
    });
module.exports = authRouter;