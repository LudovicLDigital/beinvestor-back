const SimulatorDataObject = require('./simulator-data-object');
const UserEstate = require('../models/simulator/user-estate');
const BankStats = require('../models/simulator/bank-stats');
const UserInvestorProfil = require('../models/simulator/user-investor-profil');
const SessionsResult = require('../models/simulator/session-result');
const FiscalType = require('../models/simulator/fiscal-type');
const UserSimulatorSessionValues = require('../models/simulator/user-simulator-session-values');
const {NOTARIAL_PERCENT, FAI_PERCENT} = require('./simulator-constants');
class Simulator {
    async getSimulationResultFromReq(req) {
        const simulatorDataObject = await this._prepareSimulatorDataObject(req);
        const userInvestorProfil = this._prepareUserInvestorDatas(req);
        const notarialCost = this._getNotarialCost(simulatorDataObject, req);
        const agenceCharge = this._getFAI(req, simulatorDataObject);
        return new Promise(((resolve, reject) => {
                const sessionResult = new SessionsResult();
                sessionResult.rentaBrutte = this._calculateRentabilityBrut(simulatorDataObject, notarialCost);
                resolve({
                    result: sessionResult,
                    notarialCost: notarialCost,
                    agenceCharge: agenceCharge,
                    simulatorDatas: simulatorDataObject,
                    userInvestData: userInvestorProfil,
                });
        }));
    }
    _getFAI(req, simulatorDataObject) {
        let agenceCharge;
        if (req.body.faiPercent) {
            agenceCharge = (simulatorDataObject.userEstate.buyPrice - (simulatorDataObject.userEstate.buyPrice/(1+(req.body.faiPercent / 100))));
        } else if(!req.body.noFai && !req.body.faiPercent) {
            agenceCharge = (simulatorDataObject.userEstate.buyPrice - (simulatorDataObject.userEstate.buyPrice/(1+FAI_PERCENT)));
        } else {
            agenceCharge = 0;
        }
        return agenceCharge;
    }
    _getNotarialCost(simulatorDataObject, req) {
        const agenceCharge = this._getFAI(req, simulatorDataObject);
        const buildingCost = simulatorDataObject.userEstate.buyPrice - agenceCharge;
        return (req.body.notarialCost && req.body.notarialCost > 0)
            ? req.body.notarialCost
            : NOTARIAL_PERCENT * buildingCost;
    }
    _calculateRentabilityBrut(simulatorDataObject, notarialCost) {
        let totalInvestBrut = simulatorDataObject.userEstate.buyPrice + simulatorDataObject.userEstate.workCost + notarialCost;
        return ((simulatorDataObject.userEstate.monthlyRent * 12)/totalInvestBrut)*100;
    }
    _prepareUserInvestorDatas(req) {
        return new UserInvestorProfil(null,
            req.body.professionnalSalary,
            req.body.nbEstate,
            req.body.annualRent);
    }
    async _prepareSimulatorDataObject(req) {
        const simulatorDataObject = new SimulatorDataObject();
        simulatorDataObject.userEstate = new UserEstate(null,
            req.body.buyPrice,
            req.body.surface,
            req.body.workCost,
            req.body.furnitureCost,
            req.body.monthlyRent,
            req.body.secureSaving,
            req.user.data.userInfo.id);
        simulatorDataObject.bankStats = new BankStats(null,
            req.body.is110,
            req.body.apport,
            req.body.creditWarrantyCost,
            req.body.bankCharges,
            req.body.creditTime,
            req.body.bankRate / 100);
        simulatorDataObject.fiscalType = await FiscalType.query().findById(req.body.fiscalTypeId);
        simulatorDataObject.userSimulatorSessionValues = new UserSimulatorSessionValues(null,
            req.body.percentRentManagement / 100,
            req.body.comptableCost,
            req.body.pnoCost,
            req.body.gliPercent / 100,
            req.body.vlInsurancePercent / 100);
        return simulatorDataObject;
    }
}
module.exports = Simulator;