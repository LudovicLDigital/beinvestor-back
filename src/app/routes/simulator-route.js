const Simulator = require("../simulator/simulator");
const ErrorHandler = require("../../shared/util/error-handler");
const UserInfoRepository = require('../repository/user/user-personal-info-repository');
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const simulatorRouter = require('../../shared/config/router-configurator');
const Constants = require('../../shared/constants');
/** Set default endpoint to run simulator calc**/
simulatorRouter.route('/api/simulator')
    .post(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.SIMULATOR), function (req, res) {
        console.log(`====TRYING RUN SIMULATOR===`);
        const simulator = new Simulator();
        UserInfoRepository.getUserInfoByUserId(req.user.data.id).then((info) => {
            req.user.data.userInfo = info;
            simulator.getSimulationResultFromReq(req).then((simulatorResult) => {
                res.json(simulatorResult);
            }).catch((err) => {
                console.log(`/simulator HAVE FAILED on getSimulationResultFromReq, error : ${err}`);
                ErrorHandler.errorHandler(err, res);
            });
        }).catch((err) => {
            console.log(`/simulator HAVE FAILED on getUserInfoByUserId, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = simulatorRouter;