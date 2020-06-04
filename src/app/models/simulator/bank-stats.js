const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class BankStats extends Model {
    constructor(id, is110, apport, creditWarrantyCost, bankCharges, creditTime, bankRate) {
        super();
        this.id = id;
        this.is110 = is110;
        this.apport = apport;
        this.creditWarrantyCost = creditWarrantyCost;
        this.bankCharges = bankCharges;
        this.creditTime = creditTime;
        this.bankRate = bankRate;
    }

    static get tableName() {
        return "bank_stats";
    }
}
BankStats.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = BankStats;