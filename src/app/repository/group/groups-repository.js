const Group = require("../../models/group/group");
const City = require("../../models/location/city");
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
    static async getGroupsInCitiesIdsArray(citiesId) {
        return await Group.query()
            .whereIn('groups.cityId', citiesId)
            .throwIfNotFound();
    }
}
module.exports = GroupRepository;