const Group = require("../../models/group/group");
const City = require("../../models/location/city");
class GroupRepository {
    static async getGroupList(){
        return await Group.query().select();
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
    static async getGroupByCityName(cityName){
        return await Group.query().select()
            .whereIn('groups.cityId',
                City.query().select('city.id')
                    .where('city.name', 'like', `%${cityName}%`)
                    .orderBy('city.name'))
            .throwIfNotFound();
    }
    static async getGroupByTerms(term){
        return await Group.query().select()
            .whereIn('groups.cityId',
                City.query().select('city.id')
                    .where('city.name', 'like', `%${term}%`)
                    .orderBy('city.name'))
            .orWhere('groups.name', 'like', `%${term}%`)
            .throwIfNotFound();
    }
    static async getGroupByCityId(cityId){
        return await Group.query()
            .where('cityId', cityId)
            .first()
            .throwIfNotFound();
    }
}
module.exports = GroupRepository;