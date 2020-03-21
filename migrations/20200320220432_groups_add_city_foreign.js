
exports.up = function(knex) {
    return knex.schema.table("groups", table => {
        table.foreign("cityId", "fk_group_city").references("city.id").onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema.table("groups", table => {
        table.dropForeign("cityId", "fk_group_city");
    });
};
