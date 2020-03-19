const User = require("../../models/user/user");
class UserRolesRepository {
    static async createUserRole(userId, roleId){
        return await User.relatedQuery('roles')
            .for(userId) // the "from" of "through" relationMapping
            .relate(roleId); // the "to" of "through" relationMapping
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