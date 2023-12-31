const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class UserInvestorProfil extends Model {
    constructor(id, professionnalSalary, nbEstate, annualRent, actualCreditMensualities, fiscalPart) {
        super();
        this.id = id;
        this.professionnalSalary = professionnalSalary;
        this.nbEstate = nbEstate;
        this.annualRent = annualRent;
        this.fiscalPart = fiscalPart;
        this.actualCreditMensualities = actualCreditMensualities;
    }

    static get tableName() {
        return "user_investor_profil";
    }
}
UserInvestorProfil.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = UserInvestorProfil;