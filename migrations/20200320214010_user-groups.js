
exports.up = function(knex) {
    return knex.schema.createTable('user_groups', function (t) {
        t.increments('id').primary('pk_user_groups');
        t.integer("userInfoId").unsigned().notNullable();
        t.integer("groupId").unsigned().notNullable();
        t.timestamps(false, true);
        t.foreign("userInfoId", "fk_user_info_id_group").references("user_personal_info.id").onDelete('CASCADE');
        t.foreign("groupId", "fk_user_group_id").references("groups.id").onDelete('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_groups');
};
