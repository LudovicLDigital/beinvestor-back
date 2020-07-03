const ErrorHandler = require("../../shared/util/error-handler");
const FiscalTypeRepository = require('../repository/fiscal-type-repository');
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const simulatorRouter = require('../../shared/config/router-configurator');
const Constants = require('../../shared/constants');
/** Set default endpoint to run simulator calc**/
simulatorRouter.route('/api/fiscal-type')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_FISCAL_TYPE), function (req, res) {
        console.log(`${new Date()}====TRYING GET FISCAL TYPES===`);
        FiscalTypeRepository.getAll().then((types) => {
            res.json(types);
        }).catch((err) => {
            console.error(`${new Date()} /fiscal-type HAVE FAILED on getAll, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = simulatorRouter;