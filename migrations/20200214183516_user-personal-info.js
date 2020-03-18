
exports.up = function(knex) {
  return knex.schema.createTable("user_personal_info", table => {
      table.increments("id").primary("pk_user_personal_info");
      table.string("firstName");
      table.string("lastName");
      table.dateTime("birthDate");
      table.integer("userId").unsigned().notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("user_personal_info");
};
