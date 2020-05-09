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
        if (req.body.makeACredit) {
            if(req.body.is110) {
                totalCredit = simulatorDataObject.userEstate.buyPrice + simulatorDataObject.userEstate.workCost + notarialCost;
            } else {
                totalCredit = simulatorDataObject.userEstate.buyPrice + simulatorDataObject.userEstate.workCost + notarialCost - req.body.apport;
            }
            if(req.body.includeFurnitureInCredit) {
                totalCredit = totalCredit + simulatorDataObject.userEstate.furnitureCost;
            }
        }
        return totalCredit;
    }
    static setBankCost(req, simulatorDataObject, notarialCost) {
        if(req.body.makeACredit) {
            let totalCredit = SimulatorBankCalculator.determineTotalCreditNeeded(req, simulatorDataObject, notarialCost);
            let bankWarrantyCost = 0;
            let bankFolderCost = 0;
            if (req.body.bankCharges > 0) {
                bankFolderCost = req.body.bankCharges;
            } else {
                bankFolderCost = BANK_FOLDER_COST;
            }
            totalCredit = totalCredit + bankFolderCost;
            if (req.body.creditWarrantyCost > 0) {
                bankWarrantyCost = req.body.creditWarrantyCost;
            } else {
                bankWarrantyCost = totalCredit * BANK_GARANTY_PERCENT;
            }
            totalCredit = totalCredit + bankWarrantyCost;
            simulatorDataObject.bankStats = new BankStats(null,
                req.body.is110,
                req.body.apport,
                bankWarrantyCost,
                bankFolderCost,
                req.body.creditTime,
                req.body.bankRate / 100);
            simulatorDataObject.totalCredit = totalCredit;
            if (!req.body.includeFurnitureInCredit) {
                simulatorDataObject.totalProjectCost = totalCredit + simulatorDataObject.userEstate.furnitureCost + req.body.apport;
            } else {
                simulatorDataObject.totalProjectCost = totalCredit + req.body.apport;
            }
        } else {
            simulatorDataObject.bankStats = null;
            simulatorDataObject.totalProjectCost = simulatorDataObject.userEstate.buyPrice + simulatorDataObject.userEstate.workCost + notarialCost + simulatorDataObject.userEstate.furnitureCost;
        }
        return simulatorDataObject;
    }

    /**
     * Return an object with {mensuality, totalInterest, totalBankInsuranceCost, userEndettement, mensualityWithInsurance}
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
            mensuality : mensuality,
            totalInterest : totalInterest,
            totalBankInsuranceCost : totalBankInsuranceCost,
            mensualityWithInsurance : mensualityWithInsurance,
            userEndettement : userEndettement
        };
    }

    /**
     * Method similar as VPM existing in Excel, recover the mensuality of a credit on a period with a rate, creditTime is year
     */
    static vpm(totalCredit, creditTime, creditTaux) {
        if (creditTime === 0) {
            return 0;
        }
        if (creditTaux === 0) {
            return Tools.roundNumber(totalCredit / creditTime, 2);
        }
        return Tools.roundNumber(totalCredit * creditTaux / (1 - Math.pow(1 + creditTaux, -creditTime)), 2);
    }
}
module.exports = SimulatorBankCalculator;