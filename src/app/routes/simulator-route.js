const Simulator = require("../simulator/simulator");
const SimulatorDataObject = require("../simulator/simulator-data-object");
const ErrorHandler = require("../../shared/util/error-handler");
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const simulatorRouter = require('../../shared/config/router-configurator');
const Constants = require('../../shared/constants');
function prepareSimulatorDataObject(req) {
    const simulatorDataObject = new SimulatorDataObject();

}
/** Set default endpoint to run simulator calc**/
simulatorRouter.route('/api/simulator')
    .post(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.SIMULATOR), function (req, res) {
        console.log(`====TRYING RUN SIMULATOR===`);
        Simulator.getSimulationResult(prepareSimulatorDataObject(req)).then((simulatorResult) => {
            res.json(simulatorResult);
        }).catch((err) => {
            console.log(`/simulator HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = roleRouter;