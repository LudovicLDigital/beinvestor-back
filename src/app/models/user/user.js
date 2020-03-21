const { Model } = require("objection");
const knexInstance = require("../../../../knexInstance");
const Role = require("../roles/role");

class User extends Model {
    constructor(login, password, mail, phone) {
        super();
        this.login = login;
        this.password = password;
        this.mail = mail;
        this.phone = phone;
    }

    static get tableName() {
        return "user";
    }
    static get relationMappings() {
        const Group = require("../group/group");
        return {
            roles: {
                relation: Model.ManyToManyRelation,
                modelClass: Role,
                join: {
                    from: 'user.id',
                    through: {
                        // user_roles is the join table.
                        from: 'user_roles.userId',
                        to: 'user_roles.roleId'
                    },
                    to: 'roles.id'
                }
            },
            groups: {
                relation: Model.ManyToManyRelation,
                modelClass: Group,
                join: {
                    from: 'user.id',
                    through: {
                        // user_groups is the join table.
                        from: 'user_groups.userId',
                        to: 'user_groups.groupId'
                    },
                    to: 'groups.id'
                }
            },
        }
    }
}
User.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = User;