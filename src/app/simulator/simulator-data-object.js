class SimulatorDataObject {
    constructor(userSimulatorSessionValues, userEstate, bankStats, fiscalType, projectCost, totalCredit) {
        this.userSimulatorSessionValues = userSimulatorSessionValues;
        this.userEstate = userEstate;
        this.bankStats = bankStats;
        this.fiscalType = fiscalType;
        this.totalProjectCost = projectCost;
        this.totalCredit = totalCredit;
    }
}
module.exports = SimulatorDataObject;