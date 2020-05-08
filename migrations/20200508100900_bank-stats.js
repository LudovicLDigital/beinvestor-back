
exports.up = function(knex) {
    return knex.schema.createTable('bank_stats', function (t) {
        t.increments('id').primary('pk_bank_stats');
        t.boolean('is110%').defaultTo(true);
        t.integer('apport').defaultTo(0);
        t.integer('creditWarrantyCost');
        t.integer('bankCharges');
        t.integer('creditTime');
        t.integer('bankRate');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('bank_stats');
};
