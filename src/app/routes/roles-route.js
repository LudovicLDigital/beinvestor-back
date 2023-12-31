const UserRolesRepository = require('../repository/roles/user-roles-repository');
const RolesRepository = require('../repository/roles/roles-repository');
const ErrorHandler = require("../../shared/util/error-handler");
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const roleRouter = require('../../shared/config/router-configurator');
const Constants = require('../../shared/constants');
/** Set default endpoint for roles**/
roleRouter.route('/api/roles')
// get all roles of role table
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_ROLE), function (req, res) {
        console.log(`${new Date()}====TRYING GET ALL ROLE===`);
        RolesRepository.getRolesList().then((rolesFound) => {
            res.json(rolesFound);
        }).catch((err) => {
            console.error(`${new Date()} /roles GET ALL HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // create the passed role id for the passed user
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE_ALL, Constants.T_USER_ROLE), function(req, res){
        console.log(`${new Date()}====TRYING TO CREATE ROLE : ${req.body.roleId} FOR USER : ${req.body.userId} PASSED IN BODY ===`);
        UserRolesRepository.createUserRole(req.body.userId, req.body.roleId).then(() => {
            res.sendStatus(201);
        }).catch((err) => {
            console.error(`${new Date()} /roles CREATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // delete the passed role id of the current user logged
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE_ALL, Constants.T_USER_ROLE), function(req, res){
        console.log(`${new Date()}====TRYING TO DELETE USER-ROLE PASSED IN BODY : ${req.body} ===`);
        UserRolesRepository.deleteARole(req.body.userId, req.body.roleId).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            console.error(`${new Date()} /roles DELETE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to recover the all the roles of the passed user's id
 */
roleRouter.route('/api/roles/user/:user_id')
// get roles of the user from user_role table
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER_ROLE), function (req, res) {
        console.log(`${new Date()}====TRYING GET ROLE FOR USER ID PASSED ${req.params.user_id}===`);
        UserRolesRepository.getAllPassedUserRoles(req.params.user_id).then((rolesFound) => {
            res.json(rolesFound);
        }).catch((err) => {
            console.error(`${new Date()} /roles/user/:user_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
;
/**
 * EndPoint to recover roles of the current user
 */
roleRouter.route('/api/roles/current')
// get all roles of the current logged user
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_USER_ROLE), function (req, res) {
        console.log(`${new Date()}====TRYING GET ROLE FOR CURRENT USER===`);
        UserRolesRepository.getAllPassedUserRoles(req.user.data.id).then((rolesFound) => {
            res.json(rolesFound);
        }).catch((err) => {
            console.error(`${new Date()} /roles/user GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to act on the passed role id for the current user
 */
roleRouter.route('/api/roles/:role_id')
// create the passed role id for the current logged user
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE, Constants.T_USER_ROLE), function(req, res){
        console.log(`${new Date()}====TRYING TO CREATE PASSED ROLE FOR CURRENT USER : ${req.params.role_id}===`);
        UserRolesRepository.createUserRole(req.user.data.id, req.params.role_id).then(() => {
            res.sendStatus(201);
        }).catch((err) => {
            console.error(`${new Date()} /roles/user/role/:role_id CREATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // delete the passed role id of the current user logged
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE, Constants.T_USER_ROLE), function(req, res){
        console.log(`${new Date()}====TRYING TO DELETE PASSED ROLE FOR CURRENT USER : ${req.params.role_id}===`);
        UserRolesRepository.deleteARole(req.user.data.id, req.params.role_id).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            console.error(`${new Date()} /roles/user/role/:role_id DELETE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = roleRouter;