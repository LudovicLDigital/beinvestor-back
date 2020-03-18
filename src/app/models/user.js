const { Model } = require("objection");
const knexInstance = require("../../../knexInstance");

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
}
User.knex(knexInstance); // each model have to be linked to the knexInstance
module.exports = User;