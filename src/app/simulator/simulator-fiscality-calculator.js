const SimulatorInvestDatasCalculator = require("./simulator-invest-datas-calculator");
const TMI_FIFTH_PERCENT_AND_LIMIT = require("./simulator-constants").TMI_FIFTH_PERCENT_AND_LIMIT;
const TMI_FOURTH_PERCENT_AND_LIMIT = require("./simulator-constants").TMI_FOURTH_PERCENT_AND_LIMIT;
const TMI_THIRD_PERCENT_AND_LIMIT = require("./simulator-constants").TMI_THIRD_PERCENT_AND_LIMIT;
const TMI_SECOND_PERCENT_AND_LIMIT = require("./simulator-constants").TMI_SECOND_PERCENT_AND_LIMIT;
const TMI_FIRST_PERCENT_AND_LIMIT = require("./simulator-constants").TMI_FIRST_PERCENT_AND_LIMIT;
const SOCIAL_TAX_PERCENT = require("./simulator-constants").SOCIAL_TAX_PERCENT;
const LMP = require("./simulator-constants").LMP;
const MICRO_FONCIER = require("./simulator-constants").MICRO_FONCIER;
const NUE_REEL = require("./simulator-constants").NUE_REEL;
const MICRO_BIC = require("./simulator-constants").MICRO_BIC;
const LMNP = require("./simulator-constants").LMNP;
const Tools = require("../../shared/util/tools");

/**
 * Use this calculator to retrieve specific fiscal data calculated
 */
class SimulatorFiscalityCalculator {
    static getFiscalityData(simulatorDataObject, creditDetail, notarialCost, userInvestorProfil) {
        const annualData = SimulatorInvestDatasCalculator.annualCharges(simulatorDataObject, creditDetail);
        const annualRentCC = (simulatorDataObject.userEstate.monthlyRent + simulatorDataObject.userEstate.previsionalRentCharge) * 12;
        let imposableRent;
        let amortissements = null;
        let taxObjectCalculated; // will have { taxPS, taxIR, calculatedTMI } members
        switch (simulatorDataObject.fiscalType.name) {
            case MICRO_FONCIER:
                imposableRent = annualRentCC * 0.7;
                taxObjectCalculated = SimulatorFiscalityCalculator._getTaxes(imposableRent, userInvestorProfil);
                break;
            case NUE_REEL:
                break;
            case MICRO_BIC:
                imposableRent = annualRentCC * 0.5;
                taxObjectCalculated = SimulatorFiscalityCalculator._getTaxes(imposableRent, userInvestorProfil);
                break;
            case LMNP:
                amortissements = SimulatorFiscalityCalculator._getAmortissements(simulatorDataObject);
                imposableRent = SimulatorFiscalityCalculator._getImposableRentReal(simulatorDataObject, creditDetail, annualData, amortissements);
                taxObjectCalculated = SimulatorFiscalityCalculator._getTaxes(imposableRent, userInvestorProfil);
                break;
            case LMP:
                amortissements = SimulatorFiscalityCalculator._getAmortissements(simulatorDataObject);
                imposableRent = SimulatorFiscalityCalculator._getImposableRentReal(simulatorDataObject, creditDetail, annualData, amortissements);
                taxObjectCalculated = SimulatorFiscalityCalculator._getTaxes(imposableRent, userInvestorProfil);
                break;
        }
        return {
            taxableRent:  Tools.roundNumber(imposableRent,2), // loyer CC - (toutes charges + amortissement)
            taxPS:  Tools.roundNumber(taxObjectCalculated.taxPS,2), // prelèvement sociaux
            taxIR:  Tools.roundNumber(taxObjectCalculated.taxIR,2), // impot sur le revenu (locatif seulement)
            calculatedTMI: taxObjectCalculated.calculatedTMI,
            totalDeductiveCharges: null, // interest, insurance, comptability, tax fonciere, CFE
            amortissementAmount: amortissements // contain all degrease calculated amortissement, will be null if regime is NUE
        }
    }
    static _getTaxes(imposableRent, userInvestorProfil) {
        const taxPS = imposableRent > 0 ? imposableRent * SOCIAL_TAX_PERCENT : 0;
        const totalUserRevenu = userInvestorProfil.professionnalSalary + userInvestorProfil.annualRent;
        // faut calculer combien d'IR il doit dejà payer,
        // puis on fait le tous confondu (revenue totaux + du projet) et on retire l'impot qui été payé déjà de base
        const baseUserTaxes = SimulatorFiscalityCalculator._splitTMI(totalUserRevenu);
        const totalUserRevenuWithProject = totalUserRevenu + imposableRent;
        const allRevenuTaxe = SimulatorFiscalityCalculator._splitTMI(totalUserRevenuWithProject);
        const projectIR = allRevenuTaxe.totalImposition - baseUserTaxes.totalImposition;
        return {
            taxPS: taxPS,
            taxIR: projectIR,
            calculatedTMI: allRevenuTaxe.tmi
        }
    }
    static _splitTMI(revenu) {
        let totalImposition = 0;
        let tmi = TMI_FIRST_PERCENT_AND_LIMIT.percent;
        let delta;
        if (revenu > TMI_FIRST_PERCENT_AND_LIMIT.limit) {
            if (revenu > TMI_SECOND_PERCENT_AND_LIMIT.limit) {
                // on ajoute la totalité du palier précédent
                // ici impot de 11% sur les bornes 10 064 et 25659 soit 15 595 imposé à 11%
                delta = TMI_SECOND_PERCENT_AND_LIMIT.limit - TMI_FIRST_PERCENT_AND_LIMIT.limit;
                totalImposition = totalImposition + ( delta * TMI_SECOND_PERCENT_AND_LIMIT.percent);

                if (revenu > TMI_THIRD_PERCENT_AND_LIMIT.limit) {
                    delta = TMI_THIRD_PERCENT_AND_LIMIT.limit - TMI_SECOND_PERCENT_AND_LIMIT.limit;
                    totalImposition = totalImposition + (delta * TMI_THIRD_PERCENT_AND_LIMIT.percent);

                    if (revenu > TMI_FOURTH_PERCENT_AND_LIMIT) {
                        // TMI 45%
                        tmi = TMI_FIFTH_PERCENT_AND_LIMIT.percent;
                        delta = TMI_FOURTH_PERCENT_AND_LIMIT.limit - TMI_THIRD_PERCENT_AND_LIMIT.limit;
                        totalImposition = totalImposition + (delta * TMI_FOURTH_PERCENT_AND_LIMIT.percent);
                        delta = revenu - TMI_FOURTH_PERCENT_AND_LIMIT.limit;
                        totalImposition = totalImposition + (delta * TMI_FOURTH_PERCENT_AND_LIMIT.percent);
                    } else { // TMI 41%
                        delta = revenu - TMI_THIRD_PERCENT_AND_LIMIT.limit;
                        totalImposition = totalImposition + (delta * TMI_FOURTH_PERCENT_AND_LIMIT.percent);
                        tmi = TMI_FOURTH_PERCENT_AND_LIMIT.percent;
                    }
                } else { // TMI 30%
                    delta = revenu - TMI_SECOND_PERCENT_AND_LIMIT.limit;
                    totalImposition = totalImposition + (delta * TMI_THIRD_PERCENT_AND_LIMIT.percent);
                    tmi = TMI_THIRD_PERCENT_AND_LIMIT.percent;
                }
            } else { // TMI 11%
                delta = revenu - TMI_FIRST_PERCENT_AND_LIMIT.limit;
                totalImposition = totalImposition + (delta * TMI_SECOND_PERCENT_AND_LIMIT.percent);
                tmi = TMI_SECOND_PERCENT_AND_LIMIT.percent;
            }
        }
        return {totalImposition, tmi};
    }

    /**
     * Dans le cas LMP pas de PS mais charges sociales ( SOCIAL_CHARGES_PERCENT )
     * --> pour le calcul on prend 45% du loyer CC imposable puis on deduis le cout des charges et on applique la tmi sur le nouveau imposable:
     * Impot = (loyerNet * 45%) + (loyerNet - (loyerNet * 45%)) * TMI
     */
    static _getLMPTaxes(imposableRent, userInvestorProfil) {

    }
    static _getAmortissements(simulatorDataObject) {
        return {
            for5Year: null, // inclus meubles, frais bancaires, frais de notaire + amortissement plus longs
            for10Year: null, // inclus travaux + amortissement plus long
            for20YearAndMore: null // inclus amortissement du bien
        }
    }
    static _getImposableRentReal(simulatorDataObject, creditDetail, annualData, amortissement) {
        const totalRevenuChargedHC = SimulatorInvestDatasCalculator.totalRevenuCharged(annualData, simulatorDataObject.userEstate, simulatorDataObject.userSimulatorSessionValues);
        const totalRevenuTaxablesAfterCharges = totalRevenuChargedHC + (simulatorDataObject.userEstate.previsionalRentCharge * 12);
        // deduire les interêts
        const totalRevenuTaxable = totalRevenuTaxablesAfterCharges - amortissement.for5Year;
        return totalRevenuTaxable;
    }
}
module.exports = SimulatorFiscalityCalculator;