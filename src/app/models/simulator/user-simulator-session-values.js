const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class UserSimulatorSessionValues extends Model {
    constructor(id, percentRentManagement, comptableCost,
                pnoCost, gliPercent, vlInsurancePercent,
                userInvestorProfilId, userEstateId,
                fiscalTypeId, bankStatId, sessionResultId) {
        super();
        this.id = id;
        this.percentRentManagement = percentRentManagement;
        this.comptableCost = comptableCost;
        this.pnoCost = pnoCost;
        this.gliPercent = gliPercent;
        this.vlInsurancePercent = vlInsurancePercent;
        this.userInvestorProfilId = userInvestorProfilId;
        this.userEstateId = userEstateId;
        this.fiscalTypeId = fiscalTypeId;
        this.bankStatId = bankStatId;
        this.sessionResultId = sessionResultId;
    }

    static get tableName() {
        return "user_simulator_session_values";
    }

    static get relationMappings() {
        const BankStats = require("./bank-stats");
        const FiscalType = require("./fiscal-type");
        const SessionResult = require("./session-result");
        const UserEstate = require("./user-estate");
        const UserInvestorProfil = require("./user-investor-profil");
        return {
            bankStats: {
                relation: Model.BelongsToOneRelation,
                modelClass: BankStats,
                join: {
                    from: 'user_simulator_session_values.bankStatId',
                    to: 'bank_stats.id'
                }
            },
            fiscalType: {
                relation: Model.BelongsToOneRelation,
                modelClass: FiscalType,
                join: {
                    from: 'user_simulator_session_values.fiscalTypeId',
                    to: 'fiscal_type.id'
                }
            },
            userInvestorProfil: {
                relation: Model.BelongsToOneRelation,
                modelClass: UserInvestorProfil,
                join: {
                    from: 'user_simulator_session_values.userInvestorProfilId',
                    to: 'user_investor_profil.id'
                }
            },
            userEstate: {
                relation: Model.BelongsToOneRelation,
                modelClass: UserEstate,
                join: {
                    from: 'user_simulator_session_values.userEstateId',
                    to: 'user_estate.id'
                }
            },
            sessionResult: {
                relation: Model.BelongsToOneRelation,
                modelClass: SessionResult,
                join: {
                    from: 'user_simulator_session_values.sessionResultId',
                    to: 'session_result.id'
                }
            }
        };
    }
}
UserSimulatorSessionValues.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = UserSimulatorSessionValues;