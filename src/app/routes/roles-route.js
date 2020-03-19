const UserRolesRepository = require('../repository/roles/user-roles-repository');
const RolesRepository = require('../repository/roles/roles-repository');
const ErrorHandler = require("../../shared/util/error-handler");
const Auth = require("../../shared/middleware/auth-guard");
const roleRouter = require('../../shared/config/router-configurator');
/** Set default endpoint for roles **/
roleRouter.route('/roles')
    .get(Auth.authenticationToken, function (req, res) {
        console.log('===TRYING GET ALL ROLE===');
        RolesRepository.getRolesList().then((rolesFound) => {
            res.json(rolesFound);
        }).catch((err) => {
            console.log(`/roles GET ALL HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
roleRouter.route('/roles/user/:user_id')
    .get(Auth.authenticationToken, function (req, res) {
        console.log('===TRYING GET ROLE FOR USER ID PASSED===');
        UserRolesRepository.getAllPassedUserRoles(req.params.user_id).then((rolesFound) => {
            res.json(rolesFound);
        }).catch((err) => {
            console.log(`/roles/user/:user_id GET HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    })
;
roleRouter.route('/roles/user')
    .get(Auth.authenticationToken, function (req, res) {
        console.log('===TRYING GET ROLE FOR CURRENT USER===');
        if (Auth.currentUser) {
            UserRolesRepository.getAllPassedUserRoles(Auth.currentUser.id).then((rolesFound) => {
                res.json(rolesFound);
            }).catch((err) => {
                console.log(`/roles/user GET HAVE FAILED`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.log(`/roles/user Not authenticate`);
            res.sendStatus(401);
        }
    });

roleRouter.route('/roles/user/role/:role_id')
    .post(Auth.authenticationToken, function(req, res){
        console.log('===TRYING TO CREATE PASSED ROLE FOR CURRENT USER===');
        if (Auth.currentUser) {
            UserRolesRepository.createUserRole(Auth.currentUser.id, req.params.role_id).then(() => {
                res.sendStatus(201);
            }).catch((err) => {
                console.log(`/roles/user/role/:role_id CREATE HAVE FAILED`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.log(`/roles/user/role/:role_id Not authenticate`);
            res.sendStatus(401);
        }
    })
    .delete(Auth.authenticationToken, function(req, res){
        console.log('===TRYING TO DELETE PASSED ROLE FOR CURRENT USER===');
        if (Auth.currentUser) {
            UserRolesRepository.deleteARole(Auth.currentUser.id, req.params.role_id).then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                console.log(`/roles/user/role/:role_id DELETE HAVE FAILED`);
                ErrorHandler.errorHandler(err, res);
            });
        } else {
            console.log(`/roles/user/role/:role_id Not authenticate`);
            res.sendStatus(401);
        }
    });
module.exports = roleRouter;