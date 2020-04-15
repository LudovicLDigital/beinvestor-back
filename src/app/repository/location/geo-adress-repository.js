const GeoAdress = require("../../models/location/geo-adress");
class GeoAdressRepository {
    static async getAllGeoAdress(pagination){
        return await GeoAdress.query().select()
            .page(pagination.page, pagination.numberItem);
    }
    static async getGeoAdressById(geoAdressId){
        return await GeoAdress.query().findById(geoAdressId)
    }
    static async getGeoAdressInAPerimeter(perimeter) {
        return await GeoAdress.query().select('geo_adress.id')
            .whereBetween('geo_adress.latitude', [perimeter.latitudeMin, perimeter.latitudeMax])
            .whereBetween('geo_adress.longitude', [perimeter.longitudeMin, perimeter.longitudeMax])
            .throwIfNotFound()
    }
}
module.exports =  GeoAdressRepository;