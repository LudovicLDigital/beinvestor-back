const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class UserPersonalInfo extends Model {
    static get tableName() {
        return "user_personal_info";
    }
    static get relationMappings() {
        const User = require("./user");
        return {
            children: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'user.id',
                    to: 'user_personal_info.user_id'
                }
            }
        };
    }
}
UserPersonalInfo.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = UserPersonalInfo;