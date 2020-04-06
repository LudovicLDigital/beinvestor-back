
exports.up = function(knex) {
    return knex.schema.createTable('group_message', function (t) {
        t.increments('id').primary('pk_group_message');
        t.integer("userInfoId").unsigned().notNullable();
        t.integer("groupId").unsigned().notNullable();
        t.text('content', 'longtext').notNullable();
        t.timestamps(false, true);
        t.foreign("userInfoId", "fk_user_info_id_for_group_message").references("user_personal_info.id").onDelete('CASCADE');
        t.foreign("groupId", "fk_group_id_for_group_message").references("groups.id").onDelete('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('group_message');
};
