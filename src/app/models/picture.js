const { Model } = require("objection");
const knexInstance = require("../../../knexInstance");

class Picture extends Model {
    constructor(id, path, name, data) {
        super();
        this.id = id;
        this.path = path;
        this.name = name;
    }

    static get tableName() {
        return "picture";
    }
}
Picture.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = Picture;