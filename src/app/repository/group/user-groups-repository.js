const Group = require("../../models/group/group");
const UserGroup = require("../../models/group/user-groups");
const Constant = require("../../../shared/constants");
class UserGroupsRepository {
    static async addUserToGroup(groupId, userId){
        const findExisting = await UserGroup.query()
            .where('groupId', groupId).where('userInfoId', userId);
        if (!findExisting || findExisting === null || (findExisting && findExisting.length === 0)) {
            return await Group.relatedQuery('members')
                .for(groupId) // the "from" of "through" relationMapping
                .relate(userId); // the "to" of "through" relationMapping
        } else {
            return Constant.ERROR_400_FUNC('Already in the group');
        }
    }
    static async userIsInGroup(groupId, userId) {
        const findExisting = await UserGroup.query()
            .where('groupId', groupId).where('userInfoId', userId);
        if (!findExisting || findExisting === null || (findExisting && findExisting.length === 0)) {
            return Promise.resolve(false);
        } else {
            return Promise.resolve(true);
        }
    }
    static async getAllMembers(groupId){
        return await Group.relatedQuery('members')
            .for(groupId).throwIfNotFound();
    }
    static async getAllGroupOfUser(userId, pagination){
        const UserInfo = require("../../models/user/user-personal-info");
        return await UserInfo.relatedQuery('groups')
            .for(userId)
            .page(pagination.page, pagination.numberItem).throwIfNotFound();
    }
    static async deleteAMember(groupId, userId) {
        return await Group.relatedQuery('members')
            .for(groupId)
            .unrelate()
            .where('userInfoId', userId).throwIfNotFound();
    }
}
module.exports = UserGroupsRepository;