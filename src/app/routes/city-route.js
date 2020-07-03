const ErrorHandler = require("../../shared/util/error-handler");
const CityRepository = require("../repository/location/city-repository");
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const cityRouter = require('../../shared/config/router-configurator');
const Constants = require('../../shared/constants');
/** Set default endpoint for groups**/
cityRouter.route('/api/city/all/:pagination')
    // get All, :pagination is an object as {"page": number, "numberItem": number}
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_CITY), async function(req, res){
        console.log(`${new Date()}====TRYING TO GET ALL CITIES ===`);
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
            CityRepository.getAllCity(pagination).then((cities) => {
                res.json(cities);
            }).catch((err) => {
                console.error(`${new Date()}/city GET ALL HAVE FAILED, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        } catch (error) {
            res.status(500).send(error);
            console.error(error)
        }
    });
cityRouter.route('/api/city/name/:name/:pagination')
// get the list of city by name, :pagination is an object as {"page": number, "numberItem": number}
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_CITY), function(req, res){
        console.log(`${new Date()}====TRYING TO GET ALL CITIES WITH NAME: ${req.params.name}===`);
        const paginationParam = JSON.parse(req.params.pagination);
        let pagination = {
            page: 0,
            numberItem: Constants.PAGING_ITEM_LIMIT
        };
        if(paginationParam) {
            pagination.page = paginationParam.page ? paginationParam.page : 0;
            pagination.numberItem = paginationParam.numberItem ? paginationParam.numberItem : Constants.PAGING_ITEM_LIMIT;
        }
        CityRepository.getByCityName(req.params.name, pagination).then((cities) => {
            res.json(cities);
        }).catch((err) => {
            console.error(`${new Date()}/city/:name/:pagination GET BY NAME HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
cityRouter.route('/api/city/:city_id')
// get the id's city
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_CITY), function(req, res){
        console.log(`${new Date()}====TRYING TO GET CITY WITH ID : ${req.params.city_id}===`);
        CityRepository.getCityById(req.params.city_id).then((city) => {
            res.json(city);
        }).catch((err) => {
            console.error(`${new Date()} /api/city/id/:city_id GET BY ID HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
cityRouter.route('/api/city/geo-adress-of/:city_id')
// get the id's city
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_CITY), function(req, res){
        console.log(`${new Date()}====TRYING TO GET CITY's GEO ADRESS WITH CITY ID : ${req.params.city_id}===`);
        CityRepository.getCityGeoAdress(req.params.city_id).then((geoAdress) => {
            res.json(geoAdress);
        }).catch((err) => {
            console.error(`${new Date()} /api/city/:city_id GET BY ID HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = cityRouter;