const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class SessionsResult extends Model {
    constructor(id, rentaBrutte, rentaNet, cashflow, creditMonthlyCost) {
        super();
        this.id = id;
        this.rentaBrutte = rentaBrutte;
        this.rentaNet = rentaNet;
        this.cashflow = cashflow;
        this.creditMonthlyCost = creditMonthlyCost;
    }

    static get tableName() {
        return "session_result";
    }
}
SessionsResult.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = SessionsResult;