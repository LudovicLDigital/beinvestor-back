
exports.up = function(knex) {
    return knex.schema.createTable('user_tokens', function (t) {
        t.increments('id').primary('pk_token');
        t.text('refreshToken', 'longtext').notNullable();
        t.integer("userId").unsigned().notNullable().unique('userId_is_unique');
        t.timestamps(false, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_tokens');
};
