const Role = require("../../models/roles/role");
class RoleRepository {
    static async getRolesList(){
        return await Role.query().select();
    }
}
module.exports = RoleRepository;