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
        console.log(`${new Date()}====TRYING TO GET USER BY LOGIN REQUESTED : ${req.body.login}===`);
        req.body.login = req.body.login.trim();
        const mailRgx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;
        if (mailRgx.test(req.body.login)) {
            connectUserByMail(req, res);
        } else {
            connectUserBylogin(req, res);
        }
    });
function connectUserByMail(req, res) {
    console.log(`${new Date()}===TRYING connectUserByMail : ${req.body.login}===`);
    UserRepository.getUserByMail(req.body.login).then((userFound) => {
        if (userFound && userFound !== null) {
            checkPassWords(userFound, req, res);
        } else {
            ErrorHandler.errorHandler({message: 'Aucun email correspondant'}, res);
        }
    }).catch((err) => {
        console.error(`${new Date()} connectUserByMail HAVE FAILED, error : ${err}`);
        ErrorHandler.errorHandler(err, res);
    });
}
function connectUserBylogin(req, res) {
    console.log(`${new Date()}===TRYING connectUserBylogin : ${req.body.login}===`);
    UserRepository.getUserByLogin(req.body.login).then((userFound) => {
        if (userFound && userFound !== null) {
            checkPassWords(userFound, req, res);
        } else {
            ErrorHandler.errorHandler({message: 'Aucun login correspondant'}, res);
        }
    }).catch((err) => {
        console.error(`${new Date()} connectUserBylogin HAVE FAILED, error : ${err}`);
        ErrorHandler.errorHandler(err, res);
    });
}
function checkPassWords(userFound, req, res) {
    PasswordCrypter.comparePassword(userFound.password, req.body.password).then((match) => {
        if (match) {
            TokenSaver.generateAndSaveUserFoundToken(req, res, userFound)
        } else {
            ErrorHandler.errorHandler({
                type: Constants.UNAUTHORIZE,
                message: 'Mot de passe incorrect'
            }, res);
        }
    }).catch((rejected) => {
        console.error(`${new Date()} REJECTED :   ${rejected}`);
        ErrorHandler.errorHandler(rejected, res);
    });
}
/**
 * You this endPoint to recover a new Access-token with passed body token
 */
authRouter.route('/api/token')
    .post(function(req, res){
        console.log(`${new Date()}====TRYING TO REQUEST A NEW ACCESS TOKEN WITH REFRESH TOKEN===`);
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
                    console.error(`${new Date()} /token HAVE FAILED on getAllPassedUserRoles, error : ${err}`);
                    ErrorHandler.errorHandler(error, res);
                })
            })
        }).catch((err) => {
            console.error(`${new Date()} /token HAVE FAILED on getTokenSaved, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to logout (delete the refresh token from database )
 */
authRouter.route('/api/logout')
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE, Constants.T_USER_TOKEN), function(req, res){
        console.log(`${new Date()}====TRYING TO LOGOUT WITH TOKEN DELETION===`);
        Auth.currentUser = null;
        const token = req.body.token.replace(/"/g, '');
        UserTokenRepository.deleteToken(token).then(() => {
            res.sendStatus(204)
        }).catch((err) => {
            console.error(`${new Date()} /logout HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to subscribe user
 */
authRouter.route('/api/subscribe')
    .post(function(req, res) {
        console.log(`${new Date()}==========NEW USER: ${req.body.login} TRY TO SUBSCRIBE=============`);
        const user = {
            login: req.body.login,
            password: req.body.password,
            mail: req.body.mail,
            phone: req.body.phone
        };
        user.userInfo = req.body.userInfo ? req.body.userInfo : null;
        UserRepository.getUserByLogin(user.login).then(() => {
            console.log(`${new Date()} ====== PROCESS SUBSCRIBE ENDED WITH A 400=====`);
            res.status(400).send({message: 'Identifiant déjà existant'});
        }).catch((err) => {
            if (err && err.statusCode === 404) {
                console.log(new Date() + ' getUserByLogin ======= err.statusCode : ' + err.statusCode + ' can create the user');
                crypto.randomBytes(5, function (err, buf) {
                    // Ensure the activation code is unique.
                    user.activationCode = buf.toString('hex');
                    UserRepository.createUser(user).then((userCreated) => {
                        const link = 'beinvestorapp://account/active?mail='+ user.mail +'&key=' + user.activationCode;
                        const userName = (user.userInfo && user.userInfo.firstName) ? user.userInfo.firstName: user.login;
                        const mailSubject = userName + ', activer votre compte BeInvestor !';
                        MailSender.sendAnAppMail(user.mail, mailSubject, Constants.MAIL_ACCOUNT_ACTIVATION_REQUIRED,
                            {
                                name: userName,
                                subject: mailSubject,
                                code: user.activationCode,
                                activationLink: link,
                            },
                            `Bienvenue dans la communauté BeInvestor !
                             Pour activer votre compte et profiter pleinement de l'application,
                             rentrer le code suivant dans l'application  : ${user.activationCode}`
                            ).then(() => console.log(`${new Date()} ====== PROCESS SUBSCRIBE ENDED =====`))
                            .catch((error) => console.log(`${new Date()} ====== PROCESS SUBSCRIBE ENDED WTH ERROR ${error}=====`)).catch((rejected) => {
                            console.error(`${new Date()} REJECTED : ${rejected}`);
                        });
                        res.json(userCreated);
                    }).catch((err) => {
                        console.error(`${new Date()} /subscribe createUser HAVE FAILED, error : ${err}`);
                        ErrorHandler.errorHandler(err, res);
                    });
                })
            } else {
                console.error(`${new Date()} /subscribe getUserByLogin HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            }
        })
    });
authRouter.route('/api/activate')
    .post(function(req, res) {
        console.log(`${new Date()}==========TRY TO ACTIVATE ACCOUNT WITH KEY : ${req.body.activationCode}=============`);
        if (req.body.activationCode) {
            req.body.activationCode = req.body.activationCode.trim();
            UserRepository.getUserByActivationKey(req.body.activationCode).then((user) => {
                if (user) {
                    if (user.mail === req.body.mail) {
                        UserRepository.activateUserAccount(user).then((userActivated) => {
                            res.status(200).json(userActivated);
                            console.log(`${new Date()} ====== PROCESS ACTIVATE ENDED =====`);
                        }).catch((err) => {
                            console.error(`${new Date()} /activate activateUserAccount HAVE FAILED, error : ${err}`);
                            ErrorHandler.errorHandler(err, res);
                        })
                    } else {
                        console.error(`${new Date()}====== PROCESS ACTIVATE ENDED WITH A 403 =====`);
                        res.status(403).send({message: 'Le mail ne correspond pas'})
                    }
                } else {
                    console.error(`${new Date()}====== PROCESS ACTIVATE ENDED WITH A 404 =====`);
                    res.status(404).send({message: 'Pas d\'utilisateur avec cette clé'})
                }
            }).catch((err) => {
                console.error(`${new Date()} /activate getUserByActivationKey HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.error(`${new Date()} ====== PROCESS ACTIVATE ENDED WITH A 400 =====`);
            res.status(400).send({message: 'Pas de clé d\'activation passée'});
        }
    });

authRouter.route('/api/resend-activate')
    .post(function(req, res) {
        console.log(`${new Date()}==========TRY TO RESEND ACTIVATION CODE FOR : ${req.body.mail}=============`);
        if (req.body.mail) {
            req.body.mail = req.body.mail.trim();
            UserRepository.getUserByMail(req.body.mail).then((user) => {
                if (user) {
                    crypto.randomBytes(5, function (err, buf) {
                        user.activationCode = buf.toString('hex');
                        UserRepository.updateActivationKey(user);
                        const link = 'beinvestorapp://account/active?mail='+ user.mail +'&key=' + user.activationCode;
                        const userName = (user.userInfo && user.userInfo.firstName) ? user.userInfo.firstName : user.login;
                        const mailSubject = userName + ', activer votre compte BeInvestor !';
                        MailSender.sendAnAppMail(user.mail, mailSubject, Constants.MAIL_ACCOUNT_ACTIVATION_REQUIRED,
                            {
                                name: userName,
                                subject: mailSubject,
                                code: user.activationCode,
                                activationLink: link,
                            },
                            `Bienvenue dans la communauté BeInvestor !
                             Pour activer votre compte et profiter pleinement de l'application,
                             rentrer le code suivant dans l'application  : ${user.activationCode}` ).catch((rejected) => {
                            console.error(`${new Date()} REJECTED : ${rejected}`);
                        });
                        console.log(`${new Date()}====== PROCESS RESEND ACTIVATION CODE  ENDED =====`);
                        res.sendStatus(202);
                    });
                } else {
                    console.error(`${new Date()}====== PROCESS RESEND ACTIVATION CODE  ENDED WITH A 404 =====`);
                    res.status(404).send({message: 'Aucun utilisateur trouvé avec cet email'})
                }
            }).catch((err) => {
                console.error(`${new Date()} /resend-activate getUserByMail HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.error(`${new Date()}====== PROCESS RESEND ACTIVATION CODE  ENDED WITH A 400 =====`);
            res.status(400).send({message: 'Aucun email transmis'});
        }
    });
authRouter.route('/api/reset-password')
    .post(function(req, res) {
        console.log(`${new Date()}==========TRY TO CREATE RESET KEY TO RESET PASSWORD OF: ${req.body.mail}=============`);
        if (req.body.mail) {
            req.body.mail = req.body.mail.trim();
            UserRepository.getUserByMail(req.body.mail).then((user) => {
                if (user) {
                    crypto.randomBytes(5, function (err, buf) {
                        user.resetPasswordCode = buf.toString('hex');
                        UserRepository.updateResetKey(user);
                        const link = 'beinvestorapp://account/reset??mail='+ user.mail +'&key=' + user.resetPasswordCode;
                        const userName = (user.userInfo && user.userInfo.firstName) ? user.userInfo.firstName : user.login;
                        const mailSubject = userName + ', reinitialisation du mot de passe sur BeInvestor !';
                        MailSender.sendAnAppMail(user.mail, mailSubject, Constants.MAIL_PASSWORD_RESET_REQUESTED,
                            {
                                name: userName,
                                subject: mailSubject,
                                code: user.resetPasswordCode,
                                resetLink: link,
                            },
                            `⚠️Attention ! Ce mail est envoyé car une demande de réinitialisation de mot de passe est demandée. 
                             Pour réinitialiser votre mot de passe, vous avez 24h pour
                             rentrer le code suivant dans l'application  : ${user.resetPasswordCode}   
                             Si vous n'êtes pas à l'origine de cette demande vous pouvez ignorer ce mail`).catch((rejected) => {
                            console.error(`${new Date()} REJECTED : ${rejected}`);
                        });
                        console.log('====== PROCESS RESET PASSWORD ENDED =====');
                        res.status(202).send({message: 'Mail envoyé'});
                    });
                } else {
                    console.error(`${new Date()}====== PROCESS RESET PASSWORD ENDED WITH A 404 =====`);
                    res.status(404).send({message: 'Aucun utilisateur trouvé avec cet email'})
                }
            }).catch((err) => {
                console.error(`${new Date()} /resend-activate getUserByMail HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.error(`${new Date()}====== PROCESS RESET PASSWORD ENDED WITH A 400 =====`);
            res.status(400).send({message: 'Aucun email transmis'});
        }
    });
authRouter.route('/api/reset-password-end')
    .post(function(req, res) {
        console.log(`${new Date()}==========TRY TO CREATE RESET KEY TO RESET PASSWORD OF: ${req.body.mail}=============`);
        if (req.body.mail) {
            req.body.mail = req.body.mail.trim();
            UserRepository.getUserByMail(req.body.mail).then((user) => {
                if (user) {
                    req.body.resetKey = req.body.resetKey.trim();
                    if (user.resetPasswordCode === req.body.resetKey) {
                        if (new Date().getTime() < new Date(user.resetKeyExpire)) {
                            UserRepository.changeUserPassword(req.body.newPassword, user.id);
                            const userName = (user.userInfo && user.userInfo.firstName) ? user.userInfo.firstName : user.login;
                            const mailSubject = 'Changement de votre mot de passe BeInvestor';
                            MailSender.sendAnAppMail(user.mail, mailSubject, Constants.MAIL_PASS_CHANGED,
                                {
                                    login: userName,
                                    subject: mailSubject
                                },
                                `⚠️Attention votre mot de passe vient d'être modifié !
                                Si ce n'était pas vous, nous vous invitons à changer votre mot de passe rapidement`).catch((rejected) => {
                                console.error(`${new Date()} REJECTED : ${rejected}`);
                            });
                            console.log(`${new Date()}====== PROCESS RESET PASSWORD ENDED =====`);
                            res.status(202).send({message: 'Mot de passe changé'});
                        } else {
                            console.error(`${new Date()}====== PROCESS RESET PASSWORD ENDED WITH A 400 =====`);
                            res.status(400).send({message: 'Le code n\'est plus valide, il expire au bout de 24H'})
                        }
                    } else {
                        console.error(`${new Date()}====== PROCESS RESET PASSWORD ENDED WITH A 400 =====`);
                        res.status(400).send({message: 'Le code ne correspond pas'})
                    }
                } else {
                    console.error(`${new Date()}====== PROCESS RESET PASSWORD ENDED WITH A 404 =====`);
                    res.status(404).send({message: 'Aucun utilisateur trouvé avec cet email'})
                }
            }).catch((err) => {
                console.error(`${new Date()} /resend-activate getUserByMail HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.error(`${new Date()}====== PROCESS RESET PASSWORD ENDED WITH A 400 =====`);
            res.status(400).send({message: 'Aucun email transmis'});
        }
    });
module.exports = authRouter;