const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class City extends Model {
    constructor(name,id, geoAdressId) {
        super();
        this.name = name;
        this.id = id;
        this.geoAdressId = geoAdressId;
    }

    static get tableName() {
        return "city";
    }
    static get relationMappings() {
        const GeoAdress = require("./geo-adress");
        return {
            geoAdress: {
                relation: Model.BelongsToOneRelation,
                modelClass: GeoAdress,
                join: {
                    from: 'geo_adress.id',
                    to: 'city.geoAdressId'
                }
            }
        };
    }
}
City.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = City;