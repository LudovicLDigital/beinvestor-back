exports.up = function(knex) {
    return knex.schema.table("user", table => {
        table.string('activationCode');
        table.string('resetPasswordCode');
        table.datetime('resetKeyExpire');
        table.boolean('activated');
    });
};

exports.down = function(knex) {
    return knex.schema.table("user", table => {
        table.dropColumn('activationCode');
        table.dropColumn('resetPasswordCode');
        table.dropColumn('resetKeyExpire');
        table.dropColumn('activated');
    });
};
