const SimulatorDataObject = require('./simulator-data-object');
const UserEstate = require('../models/simulator/user-estate');
const BankStats = require('../models/simulator/bank-stats');
const UserInvestorProfil = require('../models/simulator/user-investor-profil');
const SessionsResult = require('../models/simulator/session-result');
const FiscalType = require('../models/simulator/fiscal-type');
const UserSimulatorSessionValues = require('../models/simulator/user-simulator-session-values');
const {NOTARIAL_PERCENT} = require('./simulator-constants');
class Simulator {
    async getSimulationResultFromReq(req) {
        const simulatorDataObject = this._prepareSimulatorDataObject(req);
        return new Promise(((resolve, reject) => {

        }));
    }
    async _prepareSimulatorDataObject(req) {
        const simulatorDataObject = new SimulatorDataObject();
        simulatorDataObject.userEstate = new UserEstate(null, req.body.buyPrice, req.body.surface,
            req.body.workCost, req.body.furnitureCost, req.body.monthlyRent,
            req.body.secureSaving, req.user.data.userInfo.id);
        simulatorDataObject.bankStats = new BankStats(null, req.body.is110, req.body.apport,
            req.body.creditWarrantyCost, req.body.bankCharges, req.body.creditTime, req.body.bankRate);
        simulatorDataObject.fiscalType = await FiscalType.query().findById(req.body.fiscalTypeId);
        simulatorDataObject.userEstate = new UserEstate(null, req.body.buyPrice,req.body.surface,
            req.body.workCost, req.body.furnitureCost, req.body.monthlyRent,
            req.body.secureSaving, req.user.data.userInfo.id);
        simulatorDataObject.userSimulatorSessionValues = new UserSimulatorSessionValues(null,
            req.body.percentRentManagement, req.body.comptableCost,
            req.body.pnoCost, req.body.gliPercent, req.body.vlInsurancePercent);
    }
}
module.exports = Simulator;