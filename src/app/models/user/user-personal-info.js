const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");

class UserPersonalInfo extends Model {
    static get tableName() {
        return "user_personal_info";
    }
    static get relationMappings() {
        const User = require("./user");
        const Group = require("../group/group");
        const Picture = require("../picture");
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'user.id',
                    to: 'user_personal_info.user_id'
                },
            },
            picture: {
                relation: Model.BelongsToOneRelation,
                modelClass: Picture,
                join: {
                    from: 'picture.id',
                    to: 'user_personal_info.profilPicId'
                },
            },
            groups: {
                relation: Model.ManyToManyRelation,
                modelClass: Group,
                join: {
                    from: 'user_personal_info.id',
                    through: {
                        // user_groups is the join table.
                        from: 'user_groups.userInfoId',
                        to: 'user_groups.groupId'
                    },
                    to: 'groups.id'
                }
            },
        };
    }
}
UserPersonalInfo.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = UserPersonalInfo;