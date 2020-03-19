
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_roles').insert([
        {id: 1, userId: 1, roleId: 5},
        {id: 2, userId: 2, roleId: 1},
      ]);
    });
};
