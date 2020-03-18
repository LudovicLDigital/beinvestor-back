
exports.up = function(knex) {
  return knex.schema.table("user_personal_info", table => {
      table.foreign("userId", "fk_user_personal_info_user").references("user.id").onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.table("user_personal_info", table => {
      table.dropForeign("userId", "fk_user_personal_info_user");
  });
};
