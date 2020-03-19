
exports.up = function(knex) {
    return knex.schema.createTable('user_roles', function (t) {
        t.increments('id').primary('pk_user_roles');
        t.integer("userId").unsigned().notNullable();
        t.integer("roleId").unsigned().notNullable();
        t.dateTime("dateEnd");
        t.timestamps(false, true);
        t.foreign("userId", "fk_user_id_roles").references("user.id").onDelete('CASCADE');
        t.foreign("roleId", "fk_user_role_id").references("roles.id").onDelete('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_roles');
};
