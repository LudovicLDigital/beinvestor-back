
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert([
        {id: 1, title: 'freeUser'},
        {id: 2, title: 'freeNoPub'},
        {id: 3, title: 'premiumUser'},
        {id: 4, title: 'professional'},
        {id: 5, title: 'admin'}
      ]);
    });
};