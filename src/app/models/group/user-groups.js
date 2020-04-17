const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class UserGroups extends Model {
    constructor(userInfoId, groupId, joinedDate) {
        super();
        this.userInfoId = userInfoId;
        this.groupId = groupId;
        this.joinedDate = joinedDate;
    }

    static get tableName() {
        return "user_groups";
    }
}
UserGroups.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = UserGroups;