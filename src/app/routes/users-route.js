const userRouter = require('../../shared/config/router-configurator');
const UserRepository = require('../repository/user/user-repository');
const UserInfoRepository = require('../repository/user/user-personal-info-repository');
const ErrorHandler = require("../../shared/util/error-handler");
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const Constants = require("../../shared/constants");
const PasswordCrypter = require("../../shared/util/password-crypter");
const MailSender = require("../../shared/util/mail-sender");
const TokenSaver = require("../../shared/util/token-saver");
const PictureRepository = require("../repository/picture-repository");
const Picture = require("../models/picture");
const FileSaver = require("../../shared/util/file-saver");
function prepareUserDatas(req) {
    const user = {
        id: req.body.id,
        login: req.body.login,
        password: req.body.password,
        mail: req.body.mail,
        phone: req.body.phone,
    };
    user.userInfo = req.body.userInfo ? req.body.userInfo : null;
    return user;
}
/** Set default endpoint for users **/
userRouter.route('/api/users')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER),  function(req, res){
        console.log(`${new Date()} GET ALL USERS`);
        UserRepository.getAllUser().then((users) => {
            res.json(users);
        }).catch((err) => {
            console.error(`${new Date()} /users GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE_ALL, Constants.T_USER),  function(req, res) {
        console.log(`${new Date()} CREATE USERS ${req.body.login}`);
        const userDatas = prepareUserDatas(req);
        UserRepository.createUser(userDatas).then((user) => {
            res.send(user);
        }).catch((err) => {
            console.error(`${new Date()} /users POST HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .put(Auth.authenticationToken, Access.haveAccess(Constants.UPDATE_ALL, Constants.T_USER),  function(req, res){
        console.log(`${new Date()} UPDATE USER WITH ID ${req.body.id}`);
        const userDatas = prepareUserDatas(req);
        UserRepository.updateUser(userDatas).then((user) => {
            res.json(user);
        }).catch((err) => {
            console.error(`${new Date()} /users UPDATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/** get passed user's id info **/
userRouter.route('/api/users/info/:user_id')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER_INFO),  function(req, res){
        console.log(`${new Date()}===TRYING GET USER'S ID USER INFO : ${req.params.user_id} ===`);
        UserInfoRepository.getUserInfoByUserId(req.params.user_id).then((infos) => {
            res.json(infos);
        }).catch((err) => {
            console.error(`${new Date()} /users/info/:user_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * Interact with all data of users and user-personal-info for the current user
 */
userRouter.route('/api/users/current')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_USER),  function(req, res){
        console.log(`${new Date()}===TRYING GET CURRENT USER INFO===`);
        UserInfoRepository.getUserInfoByUserId(req.user.data.id).then((infos) => {
            res.json({
                user: req.user.data,
                userInfo: infos
            });
        }).catch((err) => {
            console.error(`${new Date()} /users/current GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .put(Auth.authenticationToken, Access.haveAccess(Constants.UPDATE, Constants.T_USER),  function(req, res){
        console.log(`${new Date()}==============UPDATE CURRENT USER================`);
        req.body.id = req.user.data.id;
        const userDatas = prepareUserDatas(req);
        UserRepository.updateUser(userDatas).then((user) => {
            res.json(user);
        }).catch((err) => {
            console.error(`${new Date()} /users/current UPDATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * Interact with user's id
 */
userRouter.route('/api/users/id/:user_id')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER),  function(req, res){
        console.log(`${new Date()} GET USER WITH ID ${req.params.user_id}`);
        UserRepository.getUserById(req.params.user_id).then((userFound) => {
            res.json(userFound);
        }).catch((err) => {
            console.error(`${new Date()} /users/id/:user_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE_ALL, Constants.T_USER),  function(req, res){
        console.log(`${new Date()} DELETE USER WITH ID ${req.params.user_id}`);
        UserRepository.deleteUser(req.params.user_id).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            console.error(`${new Date()} /users/id/:user_id DELETE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * Interact with login users
 */
userRouter.route('/api/users/login/:login')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER),  function(req, res){
        console.log(`${new Date()} GET USER WITH LOGIN ${req.params.login}`);
        UserRepository.getUserByLogin(req.params.login).then((userFound) => {
            res.json(userFound);
        }).catch((err) => {
            console.error(`${new Date()} /users/login/:login GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
userRouter.route('/api/users/change-password')
    .post(Auth.authenticationToken, Access.haveAccess(Constants.UPDATE, Constants.T_USER), function (req, res) {
        console.log(`${new Date()}===TRYING TO CHANGE PASSWORD OF USER : ${req.user.data.id}===`);
        PasswordCrypter.comparePassword(req.user.data.password, req.body.password).then((match) => {
            if (match) {
                UserRepository.changeUserPassword(req.body.newPassword, req.user.data.id).then((userUpdated) => {
                    const mailSubject = 'Changement de votre mot de passe BeInvestor';
                    MailSender.sendAnAppMail(userUpdated.mail, mailSubject, Constants.MAIL_PASS_CHANGED, {login: req.user.data.login, subject: mailSubject});
                    TokenSaver.generateAndSaveUserFoundToken(req, res, userUpdated);
                }).catch((rejected) => {
                    console.error(`${new Date()} REJECTED : ${rejected}`);
                    ErrorHandler.errorHandler(rejected, res);
                });
            } else {
                res.send(false);
            }
        }).catch((rejected) => {
            console.error(`${new Date()} REJECTED : ${rejected}`);
            ErrorHandler.errorHandler(rejected, res);
        });
    });
userRouter.route('/api/users/save-profil-pic')
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE, Constants.T_PICTURE), function (req, res) {
        console.log(`${new Date()}===TRYING TO SAVE PICTURE OF USER : ${req.user.data.id}===`);
        let upload = FileSaver.saveImage(req, Constants.USER_PIC + '-' + req.user.data.id + '-' + req.user.data.login);
        upload(req, res, function(err) {
            if (err) {
                console.error(new Date() + ' Error to upload');
                console.error(err);
                ErrorHandler.errorHandler(err, res);
            } else if (!req.file) {
                console.error(new Date() + ' No available file');
                console.error(err);
                ErrorHandler.errorHandler({message: 'NO FILE'}, res);
            } else {
                const pictureToSave = new Picture(null,req.file.path, req.file.filename);
                PictureRepository.saveImageDatas(pictureToSave, Constants.USER_PIC, req.file).then((pictureSaved) => {
                    UserInfoRepository.getUserInfoByUserId(req.user.data.id).then((userInfo) => {
                        UserInfoRepository.linkPicture(pictureSaved, userInfo.id).then(() => {
                            res.json(pictureSaved)
                        }).catch((error) => {
                            console.error(new Date() + ' Error to linkPicture : ' + error);
                            ErrorHandler.errorHandler(error, res);
                        });
                    }).catch((error) => {
                        console.error(new Date() + ' Error to getUserInfoByUserId : ' + error);
                        ErrorHandler.errorHandler(error, res);
                    });
                }).catch((error) => {
                    console.error(new Date() + ' Error to  saveImageDatas : ' + error);
                    ErrorHandler.errorHandler(error, res);
                });
            }
        })
    });
userRouter.route('/api/users/current/profil-pic')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_PICTURE), function (req, res) {
        console.log(`${new Date()}===TRYING TO GET CURRENT USER's PICTURE : ${req.user.data.id}===`);
        UserInfoRepository.getUserInfoByUserId(req.user.data.id).then((userInfo) => {
            PictureRepository.getPictureById(userInfo.profilPicId).then((pictureFound) => {
                if (pictureFound) {
                    res.sendFile(process.env.SERVER_ROOT + '/' + pictureFound.path)
                } else {
                    res.status(404).json({message: "No profil picture"});
                }
            }).catch((error) => {
                console.error(new Date() + ' Error to getPictureById : ' + error);
                ErrorHandler.errorHandler(error, res);
            });
        }).catch((error) => {
            console.error(new Date() + ' Error to getUserInfoByUserId : ' + error);
            ErrorHandler.errorHandler(error, res);
        });
    });
userRouter.route('/api/users/profil-pic/:id')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_PICTURE), function (req, res) {
        console.log(`${new Date()}===TRYING TO GET USER PICTURE WITH ID : ${req.params.id}===`);
        PictureRepository.getPictureById(req.params.id).then((pictureFound) => {
            res.sendFile(process.env.SERVER_ROOT + '/'+ pictureFound.path)
        }).catch((error) => {
            console.error(new Date() + ' Error to getPictureById : ' + error);
            ErrorHandler.errorHandler(error, res);
        });
    });
module.exports = userRouter;