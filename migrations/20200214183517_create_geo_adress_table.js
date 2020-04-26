
exports.up = function(knex) {
    return knex.schema.createTable('geo_adress', function (t) {
        t.increments('id').primary('pk_adress');
        t.string('latitude').notNullable();
        t.string('longitude').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('geo_adress');
};
