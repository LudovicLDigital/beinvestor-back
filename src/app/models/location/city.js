const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class City extends Model {
    constructor(name) {
        super();
        this.name = name;
    }

    static get tableName() {
        return "city";
    }
}
City.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = City;