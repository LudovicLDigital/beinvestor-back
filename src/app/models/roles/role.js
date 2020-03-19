const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class Role extends Model {
    constructor(title) {
        super();
        this.title = title;
    }

    static get tableName() {
        return "roles";
    }
}
Role.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = Role;