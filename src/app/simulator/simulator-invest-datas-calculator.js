const ESTATE_PREVENTION_PERCENT = require("./simulator-constants").ESTATE_PREVENTION_PERCENT;
const GLI_PERCENT = require("./simulator-constants").GLI_PERCENT;
const GVL_PERCENT = require("./simulator-constants").GVL_PERCENT;
const Tools = require("../../shared/util/tools");
const RENT_GESTION_PERCENT = require("./simulator-constants").RENT_GESTION_PERCENT;
/**
 * Use this Calculator for all Investment calculs
 */
class SimulatorInvestDatasCalculator {

    static calculateRentabilityBrut(simulatorDataObject, notarialCost) {
        let totalInvestBrut = simulatorDataObject.userEstate.buyPrice + simulatorDataObject.userEstate.workCost + notarialCost;
        return Tools.roundNumber((((simulatorDataObject.userEstate.monthlyRent * 12)/totalInvestBrut)*100),2);
    }
    static annualCharges(simulatorDataObject, creditDetail) {
        const sessionData = simulatorDataObject.userSimulatorSessionValues;
        const estateData = simulatorDataObject.userEstate;
        const annualRent = (estateData.monthlyRent * 12);
        const vlInsuranceCost = typeof sessionData.vlInsurancePercent !== "undefined" ?
            Tools.roundNumber(sessionData.vlInsurancePercent * annualRent,2) :
            Tools.roundNumber(GVL_PERCENT * annualRent,2);
        const gliCost = typeof sessionData.gliPercent !== "undefined" ?
            Tools.roundNumber(sessionData.gliPercent * annualRent, 2):
            Tools.roundNumber(GLI_PERCENT * annualRent, 2);
        const secureCost = typeof estateData.secureSaving !== "undefined" ?
            estateData.secureSaving * 12 :
            Tools.roundNumber((estateData.buyPrice + estateData.workCost * ESTATE_PREVENTION_PERCENT),2);
        let creditInsurance = 0;
        if (simulatorDataObject.bankStats && simulatorDataObject.bankStats !== null) {
             creditInsurance = Tools.roundNumber(creditDetail.totalBankInsuranceCost / simulatorDataObject.bankStats.creditTime, 2);
        }
        const rentGestionCost = typeof sessionData.percentRentManagement !== "undefined" ?
            Tools.roundNumber(sessionData.percentRentManagement * annualRent, 2) :
            Tools.roundNumber(annualRent * RENT_GESTION_PERCENT, 2);
        return {
            gliCost,
            annualRent,
            vlInsuranceCost,
            creditInsurance,
            secureCost,
            rentGestionCost
        }
    }
    static calculateRentaNet(simulatorDataObject, creditDetail) {
        const sessionData = simulatorDataObject.userSimulatorSessionValues;
        const estateData = simulatorDataObject.userEstate;
        const annualData = SimulatorInvestDatasCalculator.annualCharges(simulatorDataObject, creditDetail);
        let bankCharge = 0;
        if (simulatorDataObject.bankStats && simulatorDataObject.bankStats !== null) {
            bankCharge = simulatorDataObject.bankStats.creditWarrantyCost + simulatorDataObject.bankStats.bankCharges;
        }
        let totalRevenuCharged = ((simulatorDataObject.userEstate.monthlyRent * 12)
            - estateData.taxeFonciere
            - estateData.chargeCopro
            - annualData.rentGestionCost
            - sessionData.comptableCost
            - annualData.secureCost
            - sessionData.pnoCost
            - annualData.vlInsuranceCost
            - annualData.gliCost
            - annualData.creditInsurance);
        return Tools.roundNumber(((totalRevenuCharged / (simulatorDataObject.totalProjectCost + bankCharge)) * 100),2);
    }
}
module.exports = SimulatorInvestDatasCalculator;