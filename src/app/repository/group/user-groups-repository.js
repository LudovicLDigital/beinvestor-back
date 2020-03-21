const Group = require("../../models/group/group");
const UserGroup = require("../../models/group/user-groups");
const Constant = require("../../../shared/constants");
class UserGroupsRepository {
    static async addUserToGroup(groupId, userId){
        const findExisting = await UserGroup.query()
            .where('groupId', groupId).where('userId', userId);
        if (!findExisting || findExisting === null || (findExisting && findExisting.length === 0)) {
            return await Group.relatedQuery('members')
                .for(groupId) // the "from" of "through" relationMapping
                .relate(userId); // the "to" of "through" relationMapping
        } else {
            return Constant.ERROR_400_FUNC('Already in the group');
        }
    }
    static async getAllMembers(groupId){
        return await Group.relatedQuery('members')
            .for(groupId).throwIfNotFound();
    }
    static async getAllGroupOfUser(userId){
        const User = require("../../models/user/user");
        return await User.relatedQuery('groups')
            .for(userId).throwIfNotFound();
    }
    static async deleteAMember(groupId, userId) {
        return await Group.relatedQuery('members')
            .for(groupId)
            .unrelate()
            .where('userId', userId).throwIfNotFound();
    }
}
module.exports = UserGroupsRepository;