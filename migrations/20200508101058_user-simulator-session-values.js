
exports.up = function(knex) {
    return knex.schema.createTable('user_simulator_session_values', function (t) {
        t.increments('id').primary('pk_user_simulator_session_values');
        t.integer('percentRentManagement');
        t.integer('comptableCost');
        t.integer('pnoCost');
        t.integer('gliPercent');
        t.integer('vlInsurancePercent');
        t.timestamps(false, true);
        t.integer("userInvestorProfilId").unsigned().notNullable();
        t.integer("userEstateId").unsigned().notNullable();
        t.integer("fiscalTypeId").unsigned().notNullable();
        t.integer("bankStatId").unsigned().notNullable();
        t.integer("sessionResultId").unsigned().notNullable();
        t.foreign("userInvestorProfilId", "fk_user_invest_id_for_user_simulator_session_values").references("user_investor_profil.id");
        t.foreign("userEstateId", "fk_user_estate_id_for_user_simulator_session_values").references("user_estate.id");
        t.foreign("fiscalTypeId", "fk_fiscal_type_id_for_user_simulator_session_values").references("fiscal_type.id");
        t.foreign("bankStatId", "fk_bank_stat_id_for_user_simulator_session_values").references("bank_stats.id").onDelete('CASCADE');
        t.foreign("sessionResultId", "fk_session_result_for_user_simulator_session_values").references("session_result.id").onDelete('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_simulator_session_values');
};
