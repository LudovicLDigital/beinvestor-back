
exports.up = function(knex) {
    return knex.schema.createTable('roles', function (t) {
        t.increments('id').primary('pk_roles');
        t.string('title').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('roles');
};
