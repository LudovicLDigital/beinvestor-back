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
            const userInvestorProfil = this._prepareUserInvestorDatas(req.body);
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
            if (simulatorDataObject.bankStats && simulatorDataObject.bankStats !== null) {
                simulatorDataObject.bankStats.creditDetail = creditDetails;
            }
            simulatorDataObject.userInvestorProfil = userInvestorProfil;
            resolve({
                result: sessionResult,
                simulatorDatas: simulatorDataObject,
                fiscality: fiscalityData
            });
        });
    }
    _prepareUserInvestorDatas(reqBody) {
        const professionnalSalary = (Number.isNaN(Number.parseFloat(reqBody.professionnalSalary)) ? 0 : Number.parseFloat(reqBody.professionnalSalary));
        const nbEstate = (Number.isNaN(Number.parseFloat(reqBody.nbEstate)) ? 0 : Number.parseFloat(reqBody.nbEstate));
        const annualRent = (Number.isNaN(Number.parseFloat(reqBody.annualRent)) ? 0 : Number.parseFloat(reqBody.annualRent));
        const actualCreditMensualities = (Number.isNaN(Number.parseFloat(reqBody.actualCreditMensualities)) ? 0 : Number.parseFloat(reqBody.actualCreditMensualities));
        return new UserInvestorProfil(null,
            professionnalSalary,
            nbEstate,
            annualRent, // must be only imposable revenu
            actualCreditMensualities);
    }
    async _prepareSimulatorDataObject(req) {
        const simulatorDataObject = new SimulatorDataObject();
        simulatorDataObject.fiscalType = await FiscalType.query().findById(req.body.fiscalTypeId);
        simulatorDataObject.userEstate = this._prepareUserEstate(req.body);
        simulatorDataObject.userSimulatorSessionValues = this._prepareUserSimulatorSessionValues(req.body);
        return simulatorDataObject;
    }
    _prepareUserSimulatorSessionValues(reqBody){
        const percentRentManagement = (Number.isNaN(Number.parseFloat(reqBody.percentRentManagement)) ? null : Number.parseFloat(reqBody.percentRentManagement)) / 100;
        const comptableCost = (Number.isNaN(Number.parseFloat(reqBody.comptableCost)) ? 0 : Number.parseFloat(reqBody.comptableCost));
        const pnoCost = (Number.isNaN(Number.parseFloat(reqBody.pnoCost)) ? null : Number.parseFloat(reqBody.pnoCost));
        const gliPercent = (Number.isNaN(Number.parseFloat(reqBody.gliPercent)) ? null : Number.parseFloat(reqBody.gliPercent)) / 100;
        const vlInsurancePercent = (Number.isNaN(Number.parseFloat(reqBody.vlInsurancePercent)) ? null : Number.parseFloat(reqBody.vlInsurancePercent)) / 100;
        return new UserSimulatorSessionValues(null,
            percentRentManagement ,
            comptableCost,
            pnoCost,
            gliPercent ,
            vlInsurancePercent );
    }
    _prepareUserEstate(reqBody, userId) {
        const buyPrice = (Number.isNaN(Number.parseFloat(reqBody.buyPrice)) ? 0 : Number.parseFloat(reqBody.buyPrice));
        const surface = (Number.isNaN(Number.parseFloat(reqBody.surface)) ? 0 : Number.parseFloat(reqBody.surface));
        const workCost = (Number.isNaN(Number.parseFloat(reqBody.workCost)) ? 0 : Number.parseFloat(reqBody.workCost));
        const furnitureCost = (Number.isNaN(Number.parseFloat(reqBody.furnitureCost)) ? 0 : Number.parseFloat(reqBody.furnitureCost));
        const monthlyRent = (Number.isNaN(Number.parseFloat(reqBody.monthlyRent)) ? 0 : Number.parseFloat(reqBody.monthlyRent));
        const secureSaving = (Number.isNaN(Number.parseFloat(reqBody.secureSaving)) ? 0 : Number.parseFloat(reqBody.secureSaving));
        const previsionalRentCharge = (Number.isNaN(Number.parseFloat(reqBody.previsionalRentCharge)) ? 0 : Number.parseFloat(reqBody.previsionalRentCharge));
        const taxeFonciere = (Number.isNaN(Number.parseFloat(reqBody.taxeFonciere)) ? 0 : Number.parseFloat(reqBody.taxeFonciere));
        const chargeCopro = (Number.isNaN(Number.parseFloat(reqBody.chargeCopro)) ? 0 : Number.parseFloat(reqBody.chargeCopro));
        return new UserEstate(null,
            buyPrice,
            surface,
            workCost,
            furnitureCost,
            monthlyRent,
            secureSaving,
            previsionalRentCharge,
            taxeFonciere,
            chargeCopro,
            userId);
    }
}
module.exports = Simulator;