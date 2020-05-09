const {NOTARIAL_PERCENT, FAI_PERCENT} = require('./simulator-constants');

/**
 * Use this calculator to retrieve annex datas calculated as FAI, NotarialCost...
 */
class SimulatorAnnexCalculator {
    static getFAI(req, simulatorDataObject) {
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
    static getNotarialCost(simulatorDataObject, req) {
        const agenceCharge = SimulatorAnnexCalculator.getFAI(req, simulatorDataObject);
        const buildingCost = simulatorDataObject.userEstate.buyPrice - agenceCharge;
        return (req.body.notarialCost && req.body.notarialCost > 0)
            ? req.body.notarialCost
            : NOTARIAL_PERCENT * buildingCost;
    }
}

module.exports = SimulatorAnnexCalculator;