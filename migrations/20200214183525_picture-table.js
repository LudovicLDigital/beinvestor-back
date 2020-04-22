
exports.up = function(knex) {
    return knex.schema.createTable('picture', function (t) {
        t.increments('id').primary('pk_picture');
        t.string('path').notNullable();
        t.string('name').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('picture');
};
