
exports.up = function(knex) {
    return knex.schema.table("group_message", table => {
        table.text('authorName', 'longtext').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table("group_message", table => {
        table.dropColumn('authorName')
    });
};
