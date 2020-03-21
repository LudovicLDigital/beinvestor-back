
exports.up = function(knex) {
    return knex.schema.createTable('user_groups', function (t) {
        t.increments('id').primary('pk_user_groups');
        t.integer("userId").unsigned().notNullable();
        t.integer("groupId").unsigned().notNullable();
        t.timestamps(false, true);
        t.foreign("userId", "fk_user_id_group").references("user.id").onDelete('CASCADE');
        t.foreign("groupId", "fk_user_group_id").references("groups.id").onDelete('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_groups');
};
