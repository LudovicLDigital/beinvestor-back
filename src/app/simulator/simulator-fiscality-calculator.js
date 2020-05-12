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
const SOCIAL_CHARGES_PERCENT = require("./simulator-constants").SOCIAL_CHARGES_PERCENT;
const CFE_MINIMAL = require("./simulator-constants").CFE_MINIMAL;

/**
 * Use this calculator to retrieve specific fiscal data calculated
 */
class SimulatorFiscalityCalculator {
    /**
     * Method to recover the fisclaty data as return show
     * @param simulatorDataObject all datas received from the user
     * @param creditDetail the details of the bank credit
     * @param agenceCharge charge of the agence (fai)
     * @param notarialCost notarial cost calculated before
     * @param userInvestorProfil the user investor profil with datas as professionnal salary
     * @returns {{taxableRent: float, taxPS: float, taxIR: float, calculatedTMI: (number|*), totalDeductiveCharges: {gliCost, annualRent, vlInsuranceCost, creditInsurance, secureCost, rentGestionCost}, amortissementAmount: *}}
     */
    static getFiscalityData(simulatorDataObject, creditDetail, agenceCharge, notarialCost, userInvestorProfil) {
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
                imposableRent = SimulatorFiscalityCalculator._getImposableRentReal(simulatorDataObject, creditDetail, annualData, null);
                taxObjectCalculated = SimulatorFiscalityCalculator._getTaxes(imposableRent, userInvestorProfil);
                break;
            case MICRO_BIC:
                imposableRent = annualRentCC * 0.5;
                taxObjectCalculated = SimulatorFiscalityCalculator._getTaxes(imposableRent, userInvestorProfil);
                break;
            case LMNP:
                amortissements = SimulatorFiscalityCalculator._getAmortissements(simulatorDataObject, agenceCharge, notarialCost);
                imposableRent = SimulatorFiscalityCalculator._getImposableRentReal(simulatorDataObject, creditDetail, annualData, amortissements);
                taxObjectCalculated = SimulatorFiscalityCalculator._getTaxes(imposableRent, userInvestorProfil);
                break;
            case LMP:
                amortissements = SimulatorFiscalityCalculator._getAmortissements(simulatorDataObject, agenceCharge, notarialCost);
                imposableRent = SimulatorFiscalityCalculator._getImposableRentReal(simulatorDataObject, creditDetail, annualData, amortissements);
                taxObjectCalculated = SimulatorFiscalityCalculator._getLMPTaxes(imposableRent, userInvestorProfil);
                break;
        }
        return {
            taxableRent:  Tools.roundNumber(imposableRent,2), // loyer CC - (toutes charges + amortissement)
            taxPS:  Tools.roundNumber(taxObjectCalculated.taxPS,2), // prelèvement sociaux
            taxIR:  Tools.roundNumber(taxObjectCalculated.taxIR,2), // impot sur le revenu (locatif seulement)
            calculatedTMI: taxObjectCalculated.calculatedTMI,
            totalDeductiveCharges: annualData, // interest, insurance, comptability, tax fonciere, CFE
            amortissementAmount: amortissements // contain all degrease calculated amortissement, will be null if regime is NUE
        }
    }

    /**
     * Calculated taxes for fiscal regime as LMNP, MICRO-BIC &  NUE regimes
     * @param imposableRent
     * @param userInvestorProfil
     * @returns {{taxPS: float, taxIR: float, calculatedTMI: (number|*)}}
     * @private
     */
    static _getTaxes(imposableRent, userInvestorProfil) {
        let taxPS, projectIR, allRevenuTaxe;
        const totalUserRevenu = userInvestorProfil.professionnalSalary + userInvestorProfil.annualRent;
        if (imposableRent <= 0 ) {
            taxPS = projectIR = 0;
            allRevenuTaxe = SimulatorFiscalityCalculator._splitTMI(totalUserRevenu);
        } else {
            taxPS = imposableRent * SOCIAL_TAX_PERCENT;
            // faut calculer combien d'IR il doit dejà payer,
            // puis on fait le tous confondu (revenue totaux + du projet) et on retire l'impot qui été payé déjà de base
            const baseUserTaxes = SimulatorFiscalityCalculator._splitTMI(totalUserRevenu);
            const totalUserRevenuWithProject = totalUserRevenu + imposableRent;
            allRevenuTaxe = SimulatorFiscalityCalculator._splitTMI(totalUserRevenuWithProject);
            projectIR = allRevenuTaxe.totalImposition - baseUserTaxes.totalImposition;
        }
        return {
            taxPS: Tools.roundNumber(taxPS,2),
            taxIR: Tools.roundNumber(projectIR,2),
            calculatedTMI: allRevenuTaxe.tmi
        }
    }

    /**
     * Method to find the amout of taxe to pay on the IR case (impot sur le revenu selon la TMI)
     * @param revenu the revenu to analyse for the tmi and IR
     * @returns {{totalImposition: float, tmi: number}}
     * @private
     */
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
        totalImposition = Tools.roundNumber(totalImposition,2);
        return {totalImposition, tmi};
    }

    /**
     * Recover taxes for the spécific LMP fiscaltype (no PS of 17.2% but 45% for social charges)
     * @param imposableRent
     * @param userInvestorProfil
     * @returns {{taxPS: float, taxIR: float, calculatedTMI: (number|*)}}
     * @private
     */
    static _getLMPTaxes(imposableRent, userInvestorProfil) {
        let taxPS, projectIR, allRevenuTaxe;
        const totalUserRevenu = userInvestorProfil.professionnalSalary + userInvestorProfil.annualRent;
        if (imposableRent <= 0 ) {
            taxPS = projectIR = 0;
            allRevenuTaxe = SimulatorFiscalityCalculator._splitTMI(totalUserRevenu);
        } else {
            /**
             * Dans le cas LMP pas de PS mais charges sociales ( SOCIAL_CHARGES_PERCENT )
             * --> pour le calcul on prend 45% du loyer CC imposable puis on deduis le cout des charges et on applique la tmi sur le nouveau imposable:
             * Impot = (loyerNet * 45%) + (loyerNet - (loyerNet * 45%)) * TMI
             */
            taxPS = imposableRent * SOCIAL_CHARGES_PERCENT;
            imposableRent = imposableRent - taxPS;
            if (imposableRent <= 0) imposableRent = 0;
            const baseUserTaxes = SimulatorFiscalityCalculator._splitTMI(totalUserRevenu);
            const totalUserRevenuWithProject = totalUserRevenu + imposableRent;
            allRevenuTaxe = SimulatorFiscalityCalculator._splitTMI(totalUserRevenuWithProject);
            projectIR = allRevenuTaxe.totalImposition - baseUserTaxes.totalImposition;
        }
        return {
            taxPS: Tools.roundNumber(taxPS,2),
            taxIR: Tools.roundNumber(projectIR,2),
            calculatedTMI: allRevenuTaxe.tmi
        }
    }

    /**
     * Calculate the amout of amortissement which can be use (only on "meublé" fiscal types)
     * @param simulatorDataObject all data filled by user
     * @param agenceCharge the fai calculated or not
     * @param notarialCost the notarial cost calculated or not
     * @returns {{for5Year: *, for10Year: *, for20YearAndMore: float, details: {furnitureAM: float, agenceChargeAM: float, notarialCostAM: float, bankAM: float, workAM: float, estateAM: float}}}
     * @private
     */
    static _getAmortissements(simulatorDataObject, agenceCharge, notarialCost) {
        const furnitureAM = Tools.roundNumber(simulatorDataObject.userEstate.furnitureCost / 5, 2);
        const agenceChargeAM = Tools.roundNumber(agenceCharge / 5,2);
        const notarialCostAM = Tools.roundNumber(notarialCost / 5,2);
        const bankAM = Tools.roundNumber((simulatorDataObject.bankStats.bankCharges + simulatorDataObject.bankStats.creditWarrantyCost)/5,2);
        const workAM = Tools.roundNumber(simulatorDataObject.userEstate.workCost / 10,2);
        const estateAM = Tools.roundNumber((simulatorDataObject.userEstate.buyPrice - agenceCharge)/30,2);
        const until5YearAM = furnitureAM + agenceChargeAM + notarialCostAM + bankAM;
        const until10YearAM = workAM;
        const moreThan20YearAM = estateAM;
        return {
            for5Year: until5YearAM + until10YearAM + moreThan20YearAM, // inclus meubles, frais bancaires, frais de notaire + amortissement plus longs
            for10Year: until10YearAM + moreThan20YearAM, // inclus travaux + amortissement plus long
            for20YearAndMore: moreThan20YearAM, // inclus amortissement du bien
            details: {
                furnitureAM,
                agenceChargeAM,
                notarialCostAM,
                bankAM,
                workAM,
                estateAM
            }
        }
    }

    /**
     * Calculate the amout on rent revenu which are taxable for IR AND PS
     * @param simulatorDataObject all data filled by user
     * @param creditDetail the credit detail calculated by bank simulator part
     * @param annualData the data charges on a year (insurance etc..)
     * @param amortissement the amortissement for meublé fiscaltype ony (is null in NUE case)
     * @returns {float} totalRevenuTaxablesAfterCharges
     * @private
     */
    static _getImposableRentReal(simulatorDataObject, creditDetail, annualData, amortissement) {
        const totalRevenuChargedHC = SimulatorInvestDatasCalculator.totalRevenuCharged(annualData, simulatorDataObject.userEstate, simulatorDataObject.userSimulatorSessionValues);
        let totalRevenuTaxablesAfterCharges = totalRevenuChargedHC + (simulatorDataObject.userEstate.previsionalRentCharge * 12) + annualData.secureCost;
        // deduire les interêts annuel moyen
        totalRevenuTaxablesAfterCharges = totalRevenuTaxablesAfterCharges - (creditDetail.totalInterest / simulatorDataObject.bankStats.creditTime);
        if (simulatorDataObject.fiscalType.name === LMNP || simulatorDataObject.fiscalType.name === LMP){
            totalRevenuTaxablesAfterCharges = totalRevenuTaxablesAfterCharges - CFE_MINIMAL; // ajout de la CFE car amortissement forcément en meublé
        }
        if (amortissement !== null) {
            totalRevenuTaxablesAfterCharges = totalRevenuTaxablesAfterCharges - amortissement.for5Year;
        }
        return Tools.roundNumber(totalRevenuTaxablesAfterCharges,2);
    }
}
module.exports = SimulatorFiscalityCalculator;