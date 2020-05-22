const {BANK_FOLDER_COST, BANK_GARANTY_PERCENT} = require('./simulator-constants');
const BankStats = require('../models/simulator/bank-stats');
const Tools = require("../../shared/util/tools");
const BANK_WARRANTY_INSURANCE_PERCENT = require("./simulator-constants").BANK_WARRANTY_INSURANCE_PERCENT;

/**
 * Use this calculator with many method to calculate related datas of bank states
 */
class SimulatorBankCalculator {
    static determineTotalCreditNeeded(req, simulatorDataObject, notarialCost) {
        let totalCredit = 0;
        const workCost = (simulatorDataObject.userEstate.workCost && simulatorDataObject.userEstate.workCost !== null) ? simulatorDataObject.userEstate.workCost : 0;
        const apport = (req.body.apport && req.body.apport !== null) ? parseFloat(req.body.apport) : 0;
        if (req.body.makeACredit) {
            if(req.body.is110) {
                totalCredit = simulatorDataObject.userEstate.buyPrice + workCost + notarialCost;
            } else {
                totalCredit = simulatorDataObject.userEstate.buyPrice + workCost + notarialCost - apport;
            }
            if(req.body.includeFurnitureInCredit) {
                const furniture = (simulatorDataObject.userEstate.furnitureCost && simulatorDataObject.userEstate.furnitureCost !== null) ? simulatorDataObject.userEstate.furnitureCost : 0;
                totalCredit = totalCredit + furniture;
            }
        }
        return totalCredit;
    }

    /**
     * Calculate the bankWarrantyCost and the bankFolderCost if not defined, it set the totalCredit & totalProjectCost too in simulatorDataObject
     * @param req
     * @param simulatorDataObject
     * @param notarialCost
     * @returns {*}
     */
    static setBankCost(req, simulatorDataObject, notarialCost) {
        if(req.body.makeACredit) {
            let totalCredit = SimulatorBankCalculator.determineTotalCreditNeeded(req, simulatorDataObject, notarialCost);
            let bankWarrantyCost = 0;
            let bankFolderCost = 0;
            if (parseFloat(req.body.bankCharges) > 0) {
                bankFolderCost = parseFloat(req.body.bankCharges);
            } else {
                bankFolderCost = BANK_FOLDER_COST;
            }
            totalCredit = totalCredit + bankFolderCost;
            if (parseFloat(req.body.creditWarrantyCost) > 0) {
                bankWarrantyCost = parseFloat(req.body.creditWarrantyCost);
            } else {
                bankWarrantyCost = Tools.roundNumber(totalCredit * BANK_GARANTY_PERCENT,2);
            }
            totalCredit = totalCredit + bankWarrantyCost;
            simulatorDataObject.bankStats = new BankStats(null,
                req.body.is110,
                parseFloat(req.body.apport),
                bankWarrantyCost,
                bankFolderCost,
                parseFloat(req.body.creditTime),
                Tools.roundNumber(parseFloat(req.body.bankRate) / 100, 4));
            simulatorDataObject.totalCredit = Tools.roundNumber(totalCredit, 2);
            if (!req.body.includeFurnitureInCredit) {
                simulatorDataObject.totalProjectCost = Tools.roundNumber(totalCredit + simulatorDataObject.userEstate.furnitureCost + parseFloat(req.body.apport), 2);
            } else {
                simulatorDataObject.totalProjectCost = Tools.roundNumber(totalCredit + parseFloat(req.body.apport), 2);
            }
        } else {
            simulatorDataObject.bankStats = null;
            simulatorDataObject.totalProjectCost = Tools.roundNumber(simulatorDataObject.userEstate.buyPrice + simulatorDataObject.userEstate.workCost + notarialCost + simulatorDataObject.userEstate.furnitureCost, 2);
        }
        return simulatorDataObject;
    }

    /**
     * Recover all detail of the credit which aren't in the simulatorDataObject.bankStats
     * @param simulatorDataObject
     * @param userInvestorProfil
     * @returns {{mensuality: float, totalInterest: float, totalBankInsuranceCost: float, mensualityWithInsurance: float, userEndettement: float}}
     */
    static getCreditDetails(simulatorDataObject, userInvestorProfil) {
        const creditTimeInMonth = simulatorDataObject.bankStats.creditTime * 12;
        const mensuality = SimulatorBankCalculator.vpm(simulatorDataObject.totalCredit, simulatorDataObject.bankStats.creditTime, simulatorDataObject.bankStats.bankRate) / 12;
        const totalInterest = (mensuality * creditTimeInMonth) - simulatorDataObject.totalCredit;
        const totalBankInsuranceCost = simulatorDataObject.totalCredit * BANK_WARRANTY_INSURANCE_PERCENT;
        const mensualityWithInsurance = mensuality + (totalBankInsuranceCost/creditTimeInMonth);
        const monthlyRevenuUser = (userInvestorProfil.professionnalSalary + userInvestorProfil.annualRent)/12;
        const userEndettement = ((mensuality + userInvestorProfil.actualCreditMensualities)/(monthlyRevenuUser + (simulatorDataObject.userEstate.monthlyRent *0.7))) * 100;
        return {
            mensuality : Tools.roundNumber(mensuality,2),
            totalInterest : Tools.roundNumber(totalInterest,2),
            totalBankInsuranceCost : Tools.roundNumber(totalBankInsuranceCost,2),
            mensualityWithInsurance : Tools.roundNumber(mensualityWithInsurance,2),
            userEndettement : Tools.roundNumber(userEndettement,2)
        };
    }

    /**
     * Method similar as VPM existing in Excel, recover the mensuality of a credit on a period with a rate, creditTime is year
     */
    static vpm(totalCredit, creditTime, creditTaux) {
        if  (totalCredit === null || creditTime === null || creditTaux === null
            ||  typeof totalCredit === "undefined" || typeof creditTime === "undefined" || typeof creditTaux === "undefined" ) {
            return 0;
        } else {
            if (creditTime === 0) {
                return 0;
            }
            if (creditTaux === 0) {
                return Tools.roundNumber(totalCredit / creditTime, 2);
            }
            return Tools.roundNumber(totalCredit * creditTaux / (1 - Math.pow(1 + creditTaux, -creditTime)), 2);
        }
    }
}
module.exports = SimulatorBankCalculator;