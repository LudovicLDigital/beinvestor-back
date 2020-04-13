const ErrorHandler = require("../../shared/util/error-handler");
const GroupRepository = require("../repository/group/groups-repository");
const UserGroupRepository = require("../repository/group/user-groups-repository");
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const groupRouter = require('../../shared/config/router-configurator');
const Constants = require('../../shared/constants');
/** Set default endpoint for groups**/
groupRouter.route('/api/groups')
// get all groups of group table
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function (req, res) {
        console.log(`====TRYING GET ALL GROUP===`);
        GroupRepository.getGroupList().then((groups) => {
            res.json(groups);
        }).catch((err) => {
            console.log(`/groups GET ALL HAVE FAILED , error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // update groups of group table
    .put(Auth.authenticationToken, Access.haveAccess(Constants.UPDATE_ALL, Constants.T_GROUP), function (req, res) {
        console.log(`====TRYING UPDATE GROUP ${req.body.id}===`);
        const groupDatas = {
            id: req.body.id,
            name: req.body.name,
            cityId: req.body.cityId
        };
        GroupRepository.updateGroup(groupDatas).then((groups) => {
            res.json(groups);
        }).catch((err) => {
            console.log(`/groups UPDATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // create group
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE_ALL, Constants.T_GROUP), function(req, res){
        console.log(`====TRYING TO CREATE GROUP ===`);
        const groupDatas = {
            name: req.body.name,
            cityId: req.body.cityId
        };
        GroupRepository.createGroup(groupDatas).then(() => {
            res.sendStatus(201);
        }).catch((err) => {
            console.log(`/groups CREATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to act on the passed group id for cityId
 */
groupRouter.route('/api/groups/city/of/:group_id')
// get the city of passed group id
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function(req, res){
        console.log(`====TRYING TO GET CITY OF THE GROUP : ${req.params.group_id}===`);
        GroupRepository.getCityGroup(req.params.group_id).then((city) => {
            res.json(city);
        }).catch((err) => {
            console.log(`/groups/city/of/:group_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to retrieve groups with city name
 */
groupRouter.route('/api/groups/city/search/:name')
// get the groups corresponding by cityname
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function(req, res){
        console.log(`====TRYING TO GET THE GROUP BY CITY NAME : ${req.params.name}===`);
        GroupRepository.getGroupByCityName(req.params.name).then((groups) => {
            res.json(groups);
        }).catch((err) => {
            console.log(`/groups/city/search/:name GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });/**
 * EndPoint to retrieve groups with corresponding terms
 */
groupRouter.route('/api/groups/terms/:term')
// get the groups corresponding by term
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function(req, res){
        console.log(`====TRYING TO GET THE GROUP BY TERMS : ${req.params.term}===`);
        GroupRepository.getGroupByTerms(req.params.term).then((groups) => {
            res.json(groups);
        }).catch((err) => {
            console.log(`/groups/terms/:term GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to retrieve group of a city
 */
groupRouter.route('/api/groups/city/:city_id')
// get the groups corresponding by city id
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function(req, res){
        console.log(`====TRYING TO GET GROUP BY CITY ID : ${req.params.city_id}===`);
        GroupRepository.getGroupByCityId(req.params.city_id).then((group) => {
            res.json(group);
        }).catch((err) => {
            console.log(`/groups/city/:city_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
// ============================================GROUP MEMBERS INTERACTION ======================================= //

groupRouter.route('/api/groups/members')
// get members of the passed group from user_group table
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE_ALL, Constants.T_USER_GROUP), function (req, res) {
        console.log(`====TRYING ADD A MEMBER TO GROUP : ${req.body.groupId}===`);
        UserGroupRepository.addUserToGroup(req.body.groupId, req.body.userId).then((created) => {
            res.sendStatus(201);
        }).catch((err) => {
            console.log(`/groups/members POST HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
// delete a member of the passed group from user_group table
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE_ALL, Constants.T_USER_GROUP), function (req, res) {
        console.log(`====TRYING DELETE A MEMBER FROM GROUP : ${req.body.groupId}===`);
        UserGroupRepository.deleteAMember(req.body.groupId, req.body.userId).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            console.log(`/groups/members DELETE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
;
/**
 * EndPoint to recover the all the groups of the passed user's id
 */
groupRouter.route('/api/groups/members/:user_id')
// get groups of the user from user_group table
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER_GROUP), function (req, res) {
        console.log(`====TRYING GET GROUP OF USER ID PASSED ${req.params.user_id}===`);
        UserGroupRepository.getAllGroupOfUser(req.params.user_id).then((groupsFound) => {
            res.json(groupsFound);
        }).catch((err) => {
            console.log(`/groups/user/:user_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
groupRouter.route('/api/groups/members/of/:group_id')
// get members of the passed group from user_group table
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`====TRYING GET All MEMBERS OF GROUP : ${req.params.group_id}===`);
        UserGroupRepository.getAllMembers(req.params.group_id).then((usersFound) => {
            res.json(usersFound);
        }).catch((err) => {
            console.log(`/groups/members/of/:group_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to recover groups of the current user
 */
groupRouter.route('/api/groups/current')
// get all groups of the current logged user
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`=====TRYING GET GROUP OF CURRENT USER===`);
        UserGroupRepository.getAllGroupOfUser(req.user.data.id).then((groupsFound) => {
            res.json(groupsFound);
        }).catch((err) => {
            console.log(`/groups/current GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to recover groups of the current user
 */
groupRouter.route('/api/groups/current/is-member/:group_id')
// get all groups of the current logged user
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`=====TRYING TO KNOW IF CURRENT USER IS MEMBER OF GROUP ===`);
        UserGroupRepository.userIsInGroup(req.params.group_id, req.user.data.id).then((isMember) => {
            res.json(isMember);
        }).catch((err) => {
            console.log(`/groups/current/is-member GET MEMBER STATUS HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to act on groups with the current user
 */
groupRouter.route('/api/groups/current/:group_id')
// the current logged user join group
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`=====TRYING CURRENT USER TO JOIN GROUP : ${req.params.group_id} ===`);
        UserGroupRepository.addUserToGroup(req.params.group_id, req.user.data.id).then(() => {
            res.sendStatus(201);
        }).catch((err) => {
            console.log(`/groups/current/:group_id CURRENT USER JOIN GROUP FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
// the current logged user left group
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`=====TRYING CURRENT USER TO LEFT GROUP : ${req.params.group_id} ===`);
        UserGroupRepository.deleteAMember(req.params.group_id, req.user.data.id).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            console.log(`/groups/current/:group_id CURRENT USER LEFT GROUP FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = groupRouter;