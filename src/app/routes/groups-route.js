const ErrorHandler = require("../../shared/util/error-handler");
const GroupRepository = require("../repository/group/groups-repository");
const UserGroupRepository = require("../repository/group/user-groups-repository");
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const groupRouter = require('../../shared/config/router-configurator');
const Constants = require('../../shared/constants');
const GeoAdressRepository = require('../repository/location/geo-adress-repository');
const CityRepository = require('../repository/location/city-repository');
const Geolocater = require('../../shared/util/geolocater');
/** Set default endpoint for groups**/
groupRouter.route('/api/groups/all/:pagination')
// get all groups of group table
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function (req, res) {
        console.log(`${new Date()}====TRYING GET ALL GROUP===`);
        try {
            const paginationParam = JSON.parse(req.params.pagination);
            let pagination = {
                page: 0,
                numberItem: Constants.PAGING_ITEM_LIMIT
            };
            if (paginationParam) {
                pagination.page = paginationParam.page ? paginationParam.page : 0;
                pagination.numberItem = paginationParam.numberItem ? paginationParam.numberItem : Constants.PAGING_ITEM_LIMIT;
            }
            GroupRepository.getGroupList(pagination).then((groups) => {
                res.json(groups);
            }).catch((err) => {
                console.error(`${new Date()}/groups GET ALL HAVE FAILED , error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } catch (error) {
            res.status(500).send(error);
            console.error(error);
        }
    })
    // update groups of group table
    .put(Auth.authenticationToken, Access.haveAccess(Constants.UPDATE_ALL, Constants.T_GROUP), function (req, res) {
        console.log(`${new Date()}====TRYING UPDATE GROUP ${req.body.id}===`);
        const groupDatas = {
            id: req.body.id,
            name: req.body.name,
            cityId: req.body.cityId
        };
        GroupRepository.updateGroup(groupDatas).then((groups) => {
            res.json(groups);
        }).catch((err) => {
            console.error(`${new Date()} /groups UPDATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // create group
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE_ALL, Constants.T_GROUP), function(req, res){
        console.log(`${new Date()}====TRYING TO CREATE GROUP ===`);
        const groupDatas = {
            name: req.body.name,
            cityId: req.body.cityId
        };
        GroupRepository.createGroup(groupDatas).then(() => {
            res.sendStatus(201);
        }).catch((err) => {
            console.error(`${new Date()} /groups CREATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to act on the passed group id for cityId
 */
groupRouter.route('/api/groups/city/of/:group_id')
// get the city of passed group id
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function(req, res){
        console.log(`${new Date()}====TRYING TO GET CITY OF THE GROUP : ${req.params.group_id}===`);
        GroupRepository.getCityGroup(req.params.group_id).then((city) => {
            res.json(city);
        }).catch((err) => {
            console.error(`${new Date()} /groups/city/of/:group_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to retrieve groups with city name
 */
groupRouter.route('/api/groups/city/search/:name/:pagination')
// get the groups corresponding by cityname
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function(req, res){
        console.log(`${new Date()}====TRYING TO GET THE GROUP BY CITY NAME : ${req.params.name}===`);
        try {
            const paginationParam = JSON.parse(req.params.pagination);
            let pagination = {
                page: 0,
                numberItem: Constants.PAGING_ITEM_LIMIT
            };
            if (paginationParam) {
                pagination.page = paginationParam.page ? paginationParam.page : 0;
                pagination.numberItem = paginationParam.numberItem ? paginationParam.numberItem : Constants.PAGING_ITEM_LIMIT;
            }
            GroupRepository.getGroupByCityName(req.params.name, pagination).then((groups) => {
                res.json(groups);
            }).catch((err) => {
                console.error(`${new Date()} /groups/city/search/:name GET HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } catch (error) {
            res.status(500).send(error);
            console.error(error);
        }
    });/**
 * EndPoint to retrieve groups with corresponding terms
 */
groupRouter.route('/api/groups/terms/:term/:pagination')
// get the groups corresponding by term
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function(req, res){
        console.log(`${new Date()}====TRYING TO GET THE GROUP BY TERMS : ${req.params.term}===`);
        try {
            const paginationParam = JSON.parse(req.params.pagination);
            let pagination = {
                page: 0,
                numberItem: Constants.PAGING_ITEM_LIMIT
            };
            if (paginationParam) {
                pagination.page = paginationParam.page ? paginationParam.page : 0;
                pagination.numberItem = paginationParam.numberItem ? paginationParam.numberItem : Constants.PAGING_ITEM_LIMIT;
            }
            GroupRepository.getGroupByTerms(req.params.term, pagination).then((groups) => {
                res.json(groups);
            }).catch((err) => {
                console.error(`${new Date()} /groups/terms/:term GET HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } catch (error) {
            res.status(500).send(error);
            console.error(error);
        }
    });
/**
 * EndPoint to retrieve group of a city
 */
groupRouter.route('/api/groups/city/:city_id')
// get the groups corresponding by city id
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), function(req, res){
        console.log(`${new Date()}====TRYING TO GET GROUP BY CITY ID : ${req.params.city_id}===`);
        GroupRepository.getGroupByCityId(req.params.city_id).then((group) => {
            res.json(group);
        }).catch((err) => {
            console.error(`${new Date()} /groups/city/:city_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
// ============================================GROUP MEMBERS INTERACTION ======================================= //

groupRouter.route('/api/groups/members')
// get members of the passed group from user_group table
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE_ALL, Constants.T_USER_GROUP), function (req, res) {
        console.log(`${new Date()}====TRYING ADD A MEMBER TO GROUP : ${req.body.groupId}===`);
        UserGroupRepository.addUserToGroup(req.body.groupId, req.body.userId).then((created) => {
            res.sendStatus(201);
        }).catch((err) => {
            console.error(`${new Date()} /groups/members POST HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // delete a member of the passed group from user_group table
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE_ALL, Constants.T_USER_GROUP), function (req, res) {
        console.log(`${new Date()}====TRYING DELETE A MEMBER FROM GROUP : ${req.body.groupId}===`);
        UserGroupRepository.deleteAMember(req.body.groupId, req.body.userId).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            console.error(`${new Date()} /groups/members DELETE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
;
/**
 * EndPoint to recover the all the groups of the passed user's id
 */
groupRouter.route('/api/groups/member/:user_id/:pagination')
// get groups of the user from user_group table
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER_GROUP), function (req, res) {
        console.log(`${new Date()}====TRYING GET GROUP OF USER ID PASSED ${req.params.user_id}===`);
        try {
            const paginationParam = JSON.parse(req.params.pagination);
            let pagination = {
                page: 0,
                numberItem: Constants.PAGING_ITEM_LIMIT
            };
            if (paginationParam) {
                pagination.page = paginationParam.page ? paginationParam.page : 0;
                pagination.numberItem = paginationParam.numberItem ? paginationParam.numberItem : Constants.PAGING_ITEM_LIMIT;
            }
            UserGroupRepository.getAllGroupOfUser(req.params.user_id, pagination).then((groupsFound) => {
                res.json(groupsFound);
            }).catch((err) => {
                console.error(`${new Date()} /groups/user/:user_id GET HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } catch (error) {
            res.status(500).send(error);
            console.error(error);
        }
    });
groupRouter.route('/api/groups/members/of/:group_id')
// get members of the passed group from user_group table
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`${new Date()}====TRYING GET All MEMBERS OF GROUP : ${req.params.group_id}===`);
        UserGroupRepository.getAllMembers(req.params.group_id).then((usersFound) => {
            res.json(usersFound);
        }).catch((err) => {
            console.error(`${new Date()} /groups/members/of/:group_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to recover groups of the current user
 */
groupRouter.route('/api/groups/current/:pagination')
// get all groups of the current logged user
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`${new Date()}=====TRYING GET GROUP OF CURRENT USER===`);
        try {
            const paginationParam = JSON.parse(req.params.pagination);
            let pagination = {
                page: 0,
                numberItem: Constants.PAGING_ITEM_LIMIT
            };
            if (paginationParam) {
                pagination.page = paginationParam.page ? paginationParam.page : 0;
                pagination.numberItem = paginationParam.numberItem ? paginationParam.numberItem : Constants.PAGING_ITEM_LIMIT;
            }
            UserGroupRepository.getAllGroupOfUser(req.user.data.userInfo.id, pagination).then((groupsFound) => {
                res.json(groupsFound);
            }).catch((err) => {
                console.error(`${new Date()} /groups/current GET HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } catch (error) {
            res.status(500).send(error);
            console.error(error);
        }
    });
/**
 * EndPoint to recover groups of the current user
 */
groupRouter.route('/api/groups/current/is-member/:group_id')
// get all groups of the current logged user
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`${new Date()}=====TRYING TO KNOW IF CURRENT USER IS MEMBER OF GROUP ===`);
        UserGroupRepository.userIsInGroup(req.params.group_id, req.user.data.userInfo.id).then((isMember) => {
            res.json(isMember);
        }).catch((err) => {
            console.error(`${new Date()} /groups/current/is-member GET MEMBER STATUS HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * EndPoint to act on groups with the current user
 */
groupRouter.route('/api/groups/current/:group_id')
// the current logged user join group
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`${new Date()}=====TRYING CURRENT USER TO JOIN GROUP : ${req.params.group_id} ===`);
        UserGroupRepository.addUserToGroup(req.params.group_id, req.user.data.userInfo.id).then(() => {
            res.sendStatus(201);
        }).catch((err) => {
            console.error(`${new Date()} /groups/current/:group_id CURRENT USER JOIN GROUP FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    // the current logged user left group
    .delete(Auth.authenticationToken, Access.haveAccess(Constants.DELETE, Constants.T_USER_GROUP),  function (req, res) {
        console.log(`${new Date()}=====TRYING CURRENT USER TO LEFT GROUP : ${req.params.group_id} ===`);
        UserGroupRepository.deleteAMember(req.params.group_id, req.user.data.userInfo.id).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            console.error(`${new Date()} /groups/current/:group_id CURRENT USER LEFT GROUP FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });

// ============================================GROUP GEOLOCATION INTERACTION ======================================= //

groupRouter.route('/api/groups/load-perimeter')
// get all groups in 100km passed perimeter
    .post(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_GROUP), async function (req, res) {
        console.log(`${new Date()}=====TRYING LOAD ONLY GROUPS IN 100KM PERIMETER PASSED IN BODY ===`);
        const position = {latitude: parseFloat(req.body.latitude), longitude: parseFloat(req.body.longitude)};
        const radius = 100;
        const perimeterCoords = Geolocater.recoverLongitudesLatitudesMax(position, radius);
        GeoAdressRepository.getGeoAdressInAPerimeter(perimeterCoords).then((geoAdresses) => {
            const arrayAdressIds = [];
            geoAdresses.forEach((value) => {
                arrayAdressIds.push(value.id);
            });
            CityRepository.getCitiesInGeoIdsArray(arrayAdressIds).then((cities) => {
                const arrayCityIds = [];
                cities.forEach((value) => {
                    arrayCityIds.push(value.id);
                });
                GroupRepository.getGroupsInCitiesIdsArray(arrayCityIds).then((groups) => {
                    groups.forEach((group) => {
                        const cityOfGroup = cities.find((city) => city.id === group.cityId);
                        if (cityOfGroup) {
                            group.city = cityOfGroup;
                            const geoAdressOfCity = geoAdresses.find((adress) => adress.id === cityOfGroup.geoAdressId);
                            if (geoAdressOfCity) {
                                group.geoCoords = geoAdressOfCity;
                            }
                        }
                    });
                    res.json(groups);
                }).catch((err) => {
                    console.error(`${new Date()} /groups/load-perimeter getGroupsInCitiesIdsArray FAILED, error : ${err}`);
                    ErrorHandler.errorHandler(err, res);
                });
            }).catch((err) => {
                console.error(`${new Date()} /groups/load-perimeter getCitiesInGeoIdsArray FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        }).catch((err) => {
            console.error(`${new Date()} /groups/load-perimeter getGeoAdressInAPerimeter FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = groupRouter;