const SimulatorDataObject = require('./simulator-data-object');
const UserEstate = require('../models/simulator/user-estate');
const UserInvestorProfil = require('../models/simulator/user-investor-profil');
const SessionsResult = require('../models/simulator/session-result');
const FiscalType = require('../models/simulator/fiscal-type');
const UserSimulatorSessionValues = require('../models/simulator/user-simulator-session-values');
const SimulatorBankCalculator = require("./simulator-bank-calculator");
const SimulatorInvestDatasCalculator = require("./simulator-invest-datas-calculator");
const SimulatorAnnexCalculator = require("./simulator-annex-calculator");
const {NOTARIAL_PERCENT} = require('./simulator-constants');
class Simulator {
    async getSimulationResultFromReq(req) {
        return new Promise(async (resolve, reject) => {
            let simulatorDataObject = await this._prepareSimulatorDataObject(req);
            const userInvestorProfil = this._prepareUserInvestorDatas(req);
            const notarialCost = SimulatorAnnexCalculator.getNotarialCost(simulatorDataObject, req);
            const agenceCharge = SimulatorAnnexCalculator.getFAI(req, simulatorDataObject);
            simulatorDataObject = SimulatorBankCalculator.setBankCost(req, simulatorDataObject, notarialCost);
            const sessionResult = new SessionsResult();
            sessionResult.rentaBrutte = SimulatorInvestDatasCalculator.calculateRentabilityBrut(simulatorDataObject, notarialCost);
            resolve({
                result: sessionResult,
                notarialCost: notarialCost,
                agenceCharge: agenceCharge,
                simulatorDatas: simulatorDataObject,
                userInvestData: userInvestorProfil,
                creditDetail: SimulatorBankCalculator.getCreditDetails(simulatorDataObject, userInvestorProfil)
            });
        });
    }
    _prepareUserInvestorDatas(req) {
        return new UserInvestorProfil(null,
            req.body.professionnalSalary,
            req.body.nbEstate,
            req.body.annualRent,
            req.body.actualCreditMensualities);
    }
    async _prepareSimulatorDataObject(req) {
        const simulatorDataObject = new SimulatorDataObject();
        simulatorDataObject.fiscalType = await FiscalType.query().findById(req.body.fiscalTypeId);
        simulatorDataObject.userEstate = new UserEstate(null,
            req.body.buyPrice,
            req.body.surface,
            req.body.workCost,
            req.body.furnitureCost,
            req.body.monthlyRent,
            req.body.secureSaving,
            req.user.data.userInfo.id);
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