
exports.up = function(knex) {
    return knex.schema.table("groups", table => {
        table.integer('totalMembers').unsigned().defaultTo(0);
    });
};

exports.down = function(knex) {
    return knex.schema.table("groups", table => {
        table.dropColumn('totalMembers')
    });
};

