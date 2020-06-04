
exports.up = function(knex) {
    return knex.schema.createTable('user_investor_profil', function (t) {
        t.increments('id').primary('pk_user_investor_profil');
        t.integer('professionnalSalary').notNullable();
        t.integer('nbEstate');
        t.integer('annualRent');
        t.integer('fiscalPart');
        t.integer('actualCreditMensualities');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_investor_profil');
};
