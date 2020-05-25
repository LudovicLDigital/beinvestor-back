const ESTATE_PREVENTION_PERCENT = require("./simulator-constants").ESTATE_PREVENTION_PERCENT;
const GLI_PERCENT = require("./simulator-constants").GLI_PERCENT;
const GVL_PERCENT = require("./simulator-constants").GVL_PERCENT;
const Tools = require("../../shared/util/tools");
const RENT_GESTION_PERCENT = require("./simulator-constants").RENT_GESTION_PERCENT;
/**
 * Use this Calculator for all Investment calculs
 */
class SimulatorInvestDatasCalculator {

    /**
     * Calculate the "rentabilité brutte" it's rent per year on the "normal" costs as notarial, work and buy price
     * @param simulatorDataObject
     * @param notarialCost
     * @returns {float}
     */
    static calculateRentabilityBrut(simulatorDataObject, notarialCost) {
        let totalInvestBrut = simulatorDataObject.userEstate.buyPrice + simulatorDataObject.userEstate.workCost + notarialCost;
        return Tools.roundNumber((((simulatorDataObject.userEstate.monthlyRent * 12)/totalInvestBrut)*100),2);
    }

    /**
     * Calculated and round all annual datas as rent / charges
     * @param simulatorDataObject
     * @param creditDetail
     * @returns {{gliCost: float, annualRent: number, vlInsuranceCost: float, creditInsurance: number, secureCost: *, rentGestionCost: float}}
     */
     static annualCharges(simulatorDataObject, creditDetail) {
        const sessionData = simulatorDataObject.userSimulatorSessionValues;
        const estateData = simulatorDataObject.userEstate;
        const annualRent = (estateData.monthlyRent * 12);
        const vlInsuranceCost = (typeof sessionData.vlInsurancePercent !== "undefined" && sessionData.vlInsurancePercent !== null) ?
            Tools.roundNumber(sessionData.vlInsurancePercent * annualRent,2) :
            Tools.roundNumber(GVL_PERCENT * annualRent,2);
        const gliCost = (typeof sessionData.gliPercent !== "undefined" && sessionData.gliPercent !== null)  ?
            Tools.roundNumber(sessionData.gliPercent * annualRent, 2):
            Tools.roundNumber(GLI_PERCENT * annualRent, 2);
        const secureCost = (typeof estateData.secureSaving !== "undefined" && estateData.secureSaving !== null ) ?
            estateData.secureSaving * 12 :
            Tools.roundNumber((estateData.buyPrice + estateData.workCost * ESTATE_PREVENTION_PERCENT),2);
        let creditInsurance = 0;
        if (simulatorDataObject.bankStats && simulatorDataObject.bankStats !== null) {
             creditInsurance = Tools.roundNumber(creditDetail.totalBankInsuranceCost / simulatorDataObject.bankStats.creditTime, 2);
        }
        const rentGestionCost = (typeof sessionData.percentRentManagement !== "undefined" && sessionData.percentRentManagement !== null )?
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

    /**
     * Calculate the "rentabilité nette" it's all rent minus charges without taxes on the total projet cost on buy time (buy price, fai, notarial, bank)
     * @param simulatorDataObject
     * @param creditDetail
     * @returns {float}
     */
    static calculateRentaNet(simulatorDataObject, creditDetail) {

        const sessionData = simulatorDataObject.userSimulatorSessionValues;
        const estateData = simulatorDataObject.userEstate;
        const annualData = SimulatorInvestDatasCalculator.annualCharges(simulatorDataObject, creditDetail);
        let bankCharge = 0;
        if (simulatorDataObject.bankStats && simulatorDataObject.bankStats !== null) {
            bankCharge = simulatorDataObject.bankStats.creditWarrantyCost + simulatorDataObject.bankStats.bankCharges;
        }
        let totalRevenuCharged = SimulatorInvestDatasCalculator.totalRevenuCharged(annualData, estateData, sessionData);
        return Tools.roundNumber(((totalRevenuCharged / (simulatorDataObject.totalProjectCost + bankCharge)) * 100),2);
    }
    /**
     * Recover the annual rent after all charges paid (monthly/yearly charges)
     * @param annualData data contain count on year (rent, gliCost etc...)
     * @param estateData data containing estate information
     * @param sessionData data containing form session for calculator's data
     * @returns {number}
     */
    static totalRevenuCharged(annualData, estateData, sessionData) {
        return (annualData.annualRent
            - estateData.taxeFonciere
            - estateData.chargeCopro
            - annualData.rentGestionCost
            - sessionData.comptableCost
            - annualData.secureCost
            - sessionData.pnoCost
            - annualData.vlInsuranceCost
            - annualData.gliCost
            - annualData.creditInsurance);
    }

    /**
     * Recover all cashflow detail, brut (rent - credit), net (CF brut - charges), NetNet (CF Net - taxes)
     * @param simulatorDataObject
     * @param creditDetail
     * @param fiscalityData
     * @returns {{cashflowBrut: float, cashflowNet: float, cashflowNetNet: number}}
     */
    static calculateCashflows(simulatorDataObject, creditDetail, fiscalityData) {
        const annualData = SimulatorInvestDatasCalculator.annualCharges(simulatorDataObject, creditDetail);
        const cashflowBrut = Tools.roundNumber(simulatorDataObject.userEstate.monthlyRent - creditDetail.mensuality,2);
        const totalRevenuCharged = SimulatorInvestDatasCalculator.totalRevenuCharged(annualData, simulatorDataObject.userEstate, simulatorDataObject.userSimulatorSessionValues);
        const cashflowNet = Tools.roundNumber((totalRevenuCharged / 12) - creditDetail.mensuality,2);
        const cashflowNetNet = cashflowNet - ((fiscalityData.taxPS + fiscalityData.taxIR)/12);
        return {
            cashflowBrut,
            cashflowNet,
            cashflowNetNet
        }

    }
}
module.exports = SimulatorInvestDatasCalculator;