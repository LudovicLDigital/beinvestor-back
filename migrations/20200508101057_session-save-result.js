
exports.up = function(knex) {
    return knex.schema.createTable('session_result', function (t) {
        t.increments('id').primary('pk_session_result');
        t.integer('rentaBrutte');
        t.integer('rentaNet');
        t.integer('cashflow');
        t.integer('creditMonthlyCost');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('session_result');
};
