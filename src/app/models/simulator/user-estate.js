const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class UserEstate extends Model {
    constructor(id, buyPrice, surface, workCost, furnitureCost, monthlyRent, secureSaving, taxeFonciere, chargeCopro, userInfoId) {
        super();
        this.id = id;
        this.buyPrice = buyPrice;
        this.surface = surface;
        this.workCost = workCost;
        this.furnitureCost = furnitureCost;
        this.monthlyRent = monthlyRent;
        this.secureSaving = secureSaving;
        this.taxeFonciere = taxeFonciere;
        this.chargeCopro = chargeCopro;
        this.userInfoId = userInfoId;
    }

    static get tableName() {
        return "user_estate";
    }
}
UserEstate.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = UserEstate;