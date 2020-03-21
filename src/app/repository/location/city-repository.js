const City = require("../../models/location/city");
class CityRepository {
    static async getAllCity(){
        return await City.query().select();
    }
    static async getCityById(cityId){
        return await City.query().findById(cityId)
    }
    static async getByCityName(cityName){
        return await City.query()
            .where('name', 'like', `%${cityName}%`)
            .orderBy('name')
            .throwIfNotFound();
    }
}
module.exports = CityRepository;