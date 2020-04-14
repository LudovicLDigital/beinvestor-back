const City = require("../../models/location/city");
const GeoAdress = require("../../models/location/geo-adress");
class CityRepository {
    static async getAllCity(pagination){
        return await City.query().select()
            .page(pagination.page, pagination.numberItem);
    }
    static async getCityById(cityId){
        return await City.query().findById(cityId)
    }
    static async getByCityName(cityName, pagination){
        return await City.query()
            .where('name', 'like', `%${cityName}%`)
            .page(pagination.page, pagination.numberItem)
            .orderBy('name')
            .throwIfNotFound();
    }
    static async getCityGeoAdress(cityId) {
        return await GeoAdress.query()
            .whereIn('geo_adress.id',
                City.query()
                    .select('city.geoAdressId')
                    .where('city.id', cityId)
            )
            .first()
            .throwIfNotFound()
    }
}
module.exports = CityRepository;