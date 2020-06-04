const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class FiscalType extends Model {
    constructor(id, name, description) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
    }

    static get tableName() {
        return "fiscal_type";
    }
}
FiscalType.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = FiscalType;