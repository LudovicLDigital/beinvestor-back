
exports.up = function(knex) {
    return knex.schema.table("user_personal_info", table => {
        table.integer('profilPicId').unsigned();
        table.foreign("profilPicId", "fk_user_info_for_profil_pic_id").references("picture.id");
    });
};

exports.down = function(knex) {
    return knex.schema.table("user_personal_info", table => {
        table.dropColumn('profilPicId')
    });
};
