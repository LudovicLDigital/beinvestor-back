/**
 * Use this Calculator for all Investment calculs
 */
class SimulatorInvestDatasCalculator {

    static calculateRentabilityBrut(simulatorDataObject, notarialCost) {
        let totalInvestBrut = simulatorDataObject.userEstate.buyPrice + simulatorDataObject.userEstate.workCost + notarialCost;
        return ((simulatorDataObject.userEstate.monthlyRent * 12)/totalInvestBrut)*100;
    }
    static calculateRentaNet(simulatorDataObject, notarialCost) {

    }
}
module.exports = SimulatorInvestDatasCalculator;