const ErrorHandler = require("../../shared/util/error-handler");
const GroupMessageRepository = require("../repository/group/groups-message-repository");
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const groupMessageRouter = require('../../shared/config/router-configurator');
const Constants = require('../../shared/constants');
/** Set default endpoint for groups**/
groupMessageRouter.route('/api/group-message')
// create message
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE, Constants.T_GROUP_MESSAGE), function(req, res){
        console.log(`====TRYING TO CREATE A MESSAGE ===`);
        const messageDatas = {
            content: req.body.content,
            groupId: req.body.groupId,
            userInfoId: req.body.userInfoId
        };
        GroupMessageRepository.createMessage(messageDatas).then((message) => {
            res.status(201).json(message);
        }).catch((err) => {
            console.log(`/group-message CREATE HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // update message
    .put(Auth.authenticationToken, Access.haveAccess(Constants.UPDATE, Constants.T_GROUP_MESSAGE), function (req, res) {
        console.log(`====TRYING UPDATE GROUP MESSAGE ${req.body.id}===`);
        const messageDatas = {
            id: req.body.id,
            content: req.body.content,
            groupId: req.body.groupId,
            userInfoId: req.body.userInfoId
        };
        GroupMessageRepository.updateMessage(messageDatas).then((message) => {
            res.json(message);
        }).catch((err) => {
            console.log(`/group-message UPDATE HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE_ALL, Constants.T_GROUP_MESSAGE), function (req, res) {
        console.log(`====TRYING DELETE MESSAGE PASSED ${req.body.id}===`);
        GroupMessageRepository.deleteAmessage(req.body.id).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            console.log(`/group-message delete HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
groupMessageRouter.route('/api/group-message/group/:group_id/:pagination')
// get the list of message :pagination is an object as {page: number, numberItem: number}
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP_MESSAGE), function(req, res){
        console.log(`====TRYING TO GET MESSAGES OF THE GROUP : ${req.params.group_id}===`);
        let pagination = {
            page: 0,
            numberItem: Constants.PAGING_ITEM_LIMIT
        };
        if(req.params.pagination) {
            pagination.page = req.params.pagination.page ? req.params.pagination.page : 0;
            pagination.numberItem = req.params.pagination.numberItem ? req.params.pagination.numberItem : Constants.PAGING_ITEM_LIMIT;
        }
        GroupMessageRepository.getAllMessageByGroupId(req.params.group_id, pagination).then((messageList) => {
            res.json(messageList);
        }).catch((err) => {
            console.log(`/group-message/group/:group_id/:pagination GET HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to get count of all user message (in all groups)
 */
groupMessageRouter.route('/api/group-message/count/user/:user_info_id')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_GROUP_MESSAGE), function(req, res){
        console.log(`====TRYING TO GET COUNT OF ALL USER MESSAGE : ${req.params.user_info_id}===`);
        GroupMessageRepository.getCountForAllMessageOfUser(req.params.user_info_id).then((numberOfMessage) => {
            res.json(numberOfMessage["count(*)"]);
        }).catch((err) => {
            console.log(`/group-message/count/user/:user_info_id GET COUNT HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to get count of all user message (in a specific group)
 */
groupMessageRouter.route('/api/group-message/count/user/:user_info_id/:group_id')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_GROUP_MESSAGE), function(req, res){
        console.log(`====TRYING TO GET COUNT OF ALL USER MESSAGE IN GROUP: ${req.params.group_id}===`);
        GroupMessageRepository.getCountUserSMessagesInGroup(req.params.user_info_id, req.params.group_id).then((numberOfMessage) => {
            res.json(numberOfMessage["count(*)"]);
        }).catch((err) => {
            console.log(`/group-message/count/user/:user_info_id/:group_id GET COUNT HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to get count message in a specific group
 */
groupMessageRouter.route('/api/group-message/count/group/:group_id')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_GROUP_MESSAGE), function(req, res){
        console.log(`====TRYING TO GET COUNT OF MESSAGE IN GROUP: ${req.params.group_id}===`);
        GroupMessageRepository.getMessageCountForGroup(req.params.group_id).then((numberOfMessage) => {
            res.json(numberOfMessage["count(*)"]);
        }).catch((err) => {
            console.log(`/group-message/count/group/:group_id GET COUNT HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
groupMessageRouter.route('/api/group-message/last/of/:group_id')
// get the latest message of a group
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_GROUP_MESSAGE),  function (req, res) {
        console.log(`====TRYING GET LATEST MESSAGE OF GROUP : ${req.params.group_id}===`);
        GroupMessageRepository.getLastGroupMessage(req.params.group_id).then((message) => {
            res.json(message);
        }).catch((err) => {
            console.log(`/group-message/last/of/:group_id GET LAST HAVE FAILED`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = groupMessageRouter;