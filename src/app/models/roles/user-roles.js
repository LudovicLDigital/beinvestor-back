const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class UserRoles extends Model {
    constructor(userId, roleId, dateEnd) {
        super();
        this.userId = userId;
        this.roleId = roleId;
        this.dateEnd = dateEnd;
    }

    static get tableName() {
        return "user_roles";
    }
}
UserRoles.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = UserRoles;