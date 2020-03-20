
exports.up = function(knex) {
    return knex.schema.createTable("groups", table => {
        table.increments("id").primary("pk_groups");
        table.string("name");
        table.integer("cityId").unsigned().notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("groups");
};