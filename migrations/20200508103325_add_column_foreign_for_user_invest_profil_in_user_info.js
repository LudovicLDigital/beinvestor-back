
exports.up = function(knex) {
    return knex.schema.table("user_personal_info", table => {
        table.integer('userInvestorId').unsigned();
        table.foreign("userInvestorId", "fk_user_investor_id_user_personal_info").references("user_investor_profil.id").onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema.table("user_personal_info", table => {
        table.dropForeign("userInvestorId", "fk_user_investor_id_user_personal_info");
        table.dropColumn('userInvestorId')
    });
};
