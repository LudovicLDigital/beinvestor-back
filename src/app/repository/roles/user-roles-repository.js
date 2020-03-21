const User = require("../../models/user/user");
const UserRole = require("../../models/roles/user-roles");
const Constant = require("../../../shared/constants");
class UserRolesRepository {
    static async createUserRole(userId, roleId){
        const findExisting = await UserRole.query()
            .where('roleId', roleId).where('userId', userId);
        if (!findExisting || findExisting === null || (findExisting && findExisting.length === 0)) {
            return await User.relatedQuery('roles')
                .for(userId) // the "from" of "through" relationMapping
                .relate(roleId); // the "to" of "through" relationMapping
        } else {
            return Constant.ERROR_400_FUNC('Already have role');
        }
    }
    static async getAllPassedUserRoles(userId){
        return await User.relatedQuery('roles')
            .for(userId).throwIfNotFound();
    }
    static async deleteARole(userId, roleId) {
        return await User.relatedQuery('roles')
            .for(userId)
            .unrelate()
            .where('roleId',roleId).throwIfNotFound();
    }
}
module.exports = UserRolesRepository;