const userRouter = require('../../shared/config/router-configurator');
const UserRepository = require('../repository/user/user-repository');
const ErrorHandler = require("../../shared/util/error-handler");
const Auth = require("../../shared/middleware/auth-guard");
/** Set default endpoint for users **/
userRouter.route('/users')
    .get(Auth.authenticationToken, function(req, res){
        console.log(`GET ALL USERS`);
        UserRepository.getAllUser().then((users) => {
            res.json(users);
        }).catch((err) => {
            console.log(`/users GET HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .post(Auth.authenticationToken, function(req, res) {
        console.log(`CREATE USERS ${req.body.login}`);
        const userDatas = {
            login: req.body.login,
            password: req.body.password,
            mail: req.body.mail,
            phone: req.body.phone,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate,
        };
        UserRepository.createUser(userDatas).then((user) => {
            res.send({
                message: `User saved in database with id : ${user.id}`
            });
        }).catch((err) => {
            console.log(`/users POST HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .put(Auth.authenticationToken, function(req, res){
        console.log(`UPDATE USER WITH ID ${req.body.id}`);
        const userDatas = {
            login: req.body.login,
            password: req.body.password,
            mail: req.body.mail,
            phone: req.body.phone,
        };
        UserRepository.updateUser(userDatas).then((user) => {
            res.json(user);
        }).catch((err) => {
            console.log(`/users UPDATE HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
userRouter.route('/users/id/:user_id')
    .get(Auth.authenticationToken, function(req, res){
        console.log(`GET USER WITH ID ${req.params.user_id}`);
        UserRepository.getUserById(req.params.user_id).then((userFound) => {
            res.json(userFound);
        }).catch((err) => {
            console.log(`/users/id/:user_id GET HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .delete(Auth.authenticationToken, function(req, res){
        console.log(`DELETE USER WITH ID ${req.params.user_id}`);
        UserRepository.deleteUser(req.params.user_id).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(`/users/id/:user_id DELETE HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
userRouter.route('/users/login/:login')
    .get(Auth.authenticationToken, function(req, res){
        console.log(`GET USER WITH LOGIN ${req.params.login}`);
        UserRepository.getUserByLogin(req.params.login).then((userFound) => {
            res.json(userFound);
        }).catch((err) => {
            console.log(`/users/login/:login GET HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = userRouter;