const SimulatorDataObject = require('./simulator-data-object');
const UserEstate = require('../models/simulator/user-estate');
const UserInvestorProfil = require('../models/simulator/user-investor-profil');
const SessionsResult = require('../models/simulator/session-result');
const FiscalType = require('../models/simulator/fiscal-type');
const UserSimulatorSessionValues = require('../models/simulator/user-simulator-session-values');
const SimulatorBankCalculator = require("./simulator-bank-calculator");
const SimulatorInvestDatasCalculator = require("./simulator-invest-datas-calculator");
const SimulatorAnnexCalculator = require("./simulator-annex-calculator");
const SimulatorFiscalityCalculator = require("./simulator-fiscality-calculator");

class Simulator {

    async getSimulationResultFromReq(req) {
        return new Promise(async (resolve, reject) => {
            let simulatorDataObject = await this._prepareSimulatorDataObject(req);
            const userInvestorProfil = this._prepareUserInvestorDatas(req);
            const notarialCost = SimulatorAnnexCalculator.getNotarialCost(simulatorDataObject, req);
            const agenceCharge = SimulatorAnnexCalculator.getFAI(req, simulatorDataObject);
            simulatorDataObject = SimulatorBankCalculator.setBankCost(req, simulatorDataObject, notarialCost);
            const sessionResult = new SessionsResult();
            const creditDetails = SimulatorBankCalculator.getCreditDetails(simulatorDataObject, userInvestorProfil);
            sessionResult.rentaBrutte = SimulatorInvestDatasCalculator.calculateRentabilityBrut(simulatorDataObject, notarialCost);
            sessionResult.rentaNet = SimulatorInvestDatasCalculator.calculateRentaNet(simulatorDataObject, creditDetails);
            const fiscalityData = SimulatorFiscalityCalculator.getFiscalityData(simulatorDataObject,creditDetails,agenceCharge, notarialCost, userInvestorProfil);
            sessionResult.cashflow = SimulatorInvestDatasCalculator.calculateCashflows(simulatorDataObject, creditDetails, fiscalityData);
            simulatorDataObject.agenceCharge = agenceCharge;
            simulatorDataObject.notarialCost = notarialCost;
            simulatorDataObject.bankStats.creditDetail = creditDetails;
            simulatorDataObject.userInvestorProfil = userInvestorProfil;
            resolve({
                result: sessionResult,
                simulatorDatas: simulatorDataObject,
                fiscality: fiscalityData
            });
        });
    }
    _prepareUserInvestorDatas(req) {
        return new UserInvestorProfil(null,
            parseFloat(req.body.professionnalSalary),
            parseFloat(req.body.nbEstate),
            parseFloat(req.body.annualRent), // must be only imposable revenu
            parseFloat(req.body.actualCreditMensualities));
    }
    async _prepareSimulatorDataObject(req) {
        const simulatorDataObject = new SimulatorDataObject();
        simulatorDataObject.fiscalType = await FiscalType.query().findById(req.body.fiscalTypeId);
        simulatorDataObject.userEstate = new UserEstate(null,
            parseFloat(req.body.buyPrice),
            parseFloat(req.body.surface),
            parseFloat(req.body.workCost),
            parseFloat(req.body.furnitureCost),
            parseFloat(req.body.monthlyRent),
            parseFloat(req.body.secureSaving),
            parseFloat(req.body.previsionalRentCharge),
            parseFloat(req.body.taxeFonciere),
            parseFloat(req.body.chargeCopro),
            req.user.data.userInfo.id);
        simulatorDataObject.userSimulatorSessionValues = new UserSimulatorSessionValues(null,
            parseFloat(req.body.percentRentManagement) / 100,
            parseFloat(req.body.comptableCost),
            parseFloat(req.body.pnoCost),
            parseFloat(req.body.gliPercent) / 100,
            parseFloat(req.body.vlInsurancePercent) / 100);
        return simulatorDataObject;
    }
}
module.exports = Simulator;