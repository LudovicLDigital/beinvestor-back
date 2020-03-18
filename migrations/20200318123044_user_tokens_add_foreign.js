
exports.up = function(knex) {
    return knex.schema.table("user_tokens", table => {
        table.foreign("userId", "fk_user_tokens_user").references("user.id").onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema.table("user_tokens", table => {
        table.dropForeign("userId", "fk_user_tokens_user");
    });
};
