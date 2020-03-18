
exports.up = function(knex) {
  return knex.schema.createTable('user', function (t) {
      t.increments('id').primary('pk_user');
      t.string('login').notNullable().unique('login_is_unique');
      t.string('password').notNullable();
      t.string('mail');
      t.string('phone');
      // timestamp add two column as TIMESTAMP type (created_at and updated_at) if first arg is true else false will be DATETIME, and if 2nd arg is true the default value is set to now
      t.timestamps(false, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user');
};
