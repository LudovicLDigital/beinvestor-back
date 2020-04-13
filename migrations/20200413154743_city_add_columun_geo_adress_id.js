
exports.up = function(knex) {
    return knex.schema.table("city", table => {
        table.integer('geoAdressId').unsigned();
        table.foreign("geoAdressId", "fk_city_geo_adress_id").references("geo_adress.id");
    });
};

exports.down = function(knex) {
    return knex.schema.table("city", table => {
        table.dropColumn('geoAdressId')
    });
};
