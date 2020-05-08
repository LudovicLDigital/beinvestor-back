class SimulatorDataObject {
    constructor(userSimulatorSessionValues, userEstate, bankStats, fiscalType) {
        this.userSimulatorSessionValues = userSimulatorSessionValues;
        this.userEstate = userEstate;
        this.bankStats = bankStats;
        this.fiscalType = fiscalType;
    }
}
module.exports = SimulatorDataObject;