const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");
const UserPersonalInfo = require("../user/user-personal-info");
const Group = require("./group");
class GroupMessage extends Model {
    constructor(id, userInfoId, groupId, content, createdAt, updatedAt) {
        super();
        this.id = id;
        this.userInfoId = userInfoId;
        this.groupId = groupId;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static get tableName() {
        return "group_message";
    }
    static get relationMappings() {
        return {
            author: {
                relation: Model.HasManyRelation,
                modelClass: UserPersonalInfo,
                join: {
                    from: 'group_message.userInfoId',
                    to: 'user_personal_info.id'
                }
            },
            group: {
                relation: Model.HasManyRelation,
                modelClass: Group,
                join: {
                    from: 'group_message.groupId',
                    to: 'groups.id'
                }
            }
        }
    }
}
GroupMessage.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = GroupMessage;