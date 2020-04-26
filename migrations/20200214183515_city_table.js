
exports.up = function(knex) {
    return knex.schema.createTable("city", table => {
        table.increments("id").primary("pk_city");
        table.string("name");
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("city");
};
