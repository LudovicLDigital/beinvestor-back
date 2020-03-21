const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");
const User = require("../user/user");
const City = require("../location/city");

class Group extends Model {
    constructor(name) {
        super();
        this.name = name;
    }

    static get tableName() {
        return "groups";
    }
    static get relationMappings() {
        return {
            members: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'groups.id',
                    through: {
                        // user_groups is the join table.
                        from: 'user_groups.groupId',
                        to: 'user_groups.userId'
                    },
                    to: 'user.id'
                }
            },
            city: {
                relation: Model.BelongsToOneRelation,
                modelClass: City,
                join: {
                    from: 'groups.cityId',
                    to: 'city.id'
                }
            }
        }
    }
}
Group.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = Group;