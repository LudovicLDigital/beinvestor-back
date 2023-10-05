
exports.up = function(knex) {
    return knex.schema.table("user_personal_info", table => {
        table.string('deviceId');
    });
};

exports.down = function(knex) {
    return knex.schema.table("user_personal_info", table => {
        table.dropColumn('deviceId');
    });
};
