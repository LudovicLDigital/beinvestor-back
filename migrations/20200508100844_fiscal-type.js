
exports.up = function(knex) {
    return knex.schema.createTable('fiscal_type', function (t) {
        t.increments('id').primary('pk_fiscal_type');
        t.string('name').notNullable();
        t.text('description');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('fiscal_type');
};