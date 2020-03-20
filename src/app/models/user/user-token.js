const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class UserToken extends Model {
    static get tableName() {
        return "user_tokens";
    }
    static get relationMappings() {
        const User = require("./user");
        return {
            children: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'user.id',
                    to: 'user_tokens.userId'
                }
            }
        };
    }
}
UserToken.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = UserToken;