const Group = require("../../models/group/group");
const City = require("../../models/location/city");
const GeoAdressRepository = require('../location/geo-adress-repository');
const Geolocater = require('../../../shared/util/geolocater');
class GroupRepository {
    static async getGroupList(pagination){
        return await Group.query().select()
            .page(pagination.page, pagination.numberItem);
    }
    static async updateGroup(groupDatas){
        return await Group.query().updateAndFetchById(groupDatas.id, groupDatas)
            .throwIfNotFound();
    }
    static async createGroup(groupDatas){
        return await Group.query().insertGraph({
            name: groupDatas.name,
            cityId: groupDatas.cityId,
        });
    }
    static async getCityGroup(groupId){
        return await Group.relatedQuery('city')
            .for(groupId).throwIfNotFound();
    }
    static async getGroupById(groupId){
        return await Group.query().findById(groupId).throwIfNotFound();
    }
    static async getGroupByCityName(cityName, pagination){
        return await Group.query().select()
            .whereIn('groups.cityId',
                City.query().select('city.id')
                    .where('city.name', 'like', `%${cityName}%`)
                    .orderBy('city.name'))
            .page(pagination.page, pagination.numberItem)
            .throwIfNotFound();
    }
    static async getGroupByTerms(term, pagination){
        return await Group.query().select()
            .whereIn('groups.cityId',
                City.query().select('city.id')
                    .where('city.name', 'like', `%${term}%`)
                    .orderBy('city.name'))
            .orWhere('groups.name', 'like', `%${term}%`)
            .page(pagination.page, pagination.numberItem)
            .throwIfNotFound();
    }
    static async getGroupByCityId(cityId){
        return await Group.query()
            .where('cityId', cityId)
            .first()
            .throwIfNotFound();
    }

    /**
     * get all group in permiter of the passed position with radius distance in km
     * @param position object which must contain latitude longitude
     * @param radius in km
     */
    static async getGroupsInPerimeter(position, radius) {
        let perimeterCoords = {
            latitudeMin: 0,
            latitudeMax: 0,
            longitudeMin: 0,
            longitudeMax: 0,
        };
        perimeterCoords = Geolocater.recoverLongitudesLatitudesMax(position, radius);
        const geoAdressesIds = await GeoAdressRepository.getGeoAdressInAPerimeter(perimeterCoords);
        const arrayAdressIds = [];
        geoAdressesIds.forEach((value) => {
            arrayAdressIds.push(value.id);
        });
        return await Group.query()
            .whereIn('groups.cityId',
                City.query()
                    .select('city.id')
                    .whereIn('city.geoAdressId', arrayAdressIds)
            )
            .throwIfNotFound();
    }
}
module.exports = GroupRepository;