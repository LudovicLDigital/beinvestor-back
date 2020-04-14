const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class GeoAdress extends Model {
    constructor(id, latitude, longitude) {
        super();
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    static get tableName() {
        return "geo_adress";
    }
}
GeoAdress.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = GeoAdress;