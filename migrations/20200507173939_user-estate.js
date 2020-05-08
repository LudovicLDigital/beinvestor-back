
exports.up = function(knex) {
    return knex.schema.createTable('user_estate', function (t) {
        t.increments('id').primary('pk_user_estate');
        t.integer('buyPrice').notNullable();
        t.integer('surface');
        t.integer('workCost');
        t.integer('furnitureCost');
        t.integer('monthlyRent');
        t.integer('secureSaving');
        t.integer('taxeFonciere');
        t.integer('chargeCopro');
        t.integer("userInfoId").unsigned().notNullable();
        t.foreign("userInfoId", "fk_user_info_id_for_user_estate").references("user_personal_info.id").onDelete('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_estate');
};
