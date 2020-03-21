
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('city').del()
    .then(function () {
      // Inserts seed entries
      return knex('city').insert([
        {id: 1, name: 'Lille'},
        {id: 2, name: 'Amiens'},
        {id: 3, name: 'Rouen'},
        {id: 4, name: 'Caen'},
        {id: 5, name: 'Rennes'},
        {id: 6, name: 'Paris'},
        {id: 7, name: 'Châlons-en-champagne'},
        {id: 8, name: 'Metz'},
        {id: 9, name: 'Strasbourg'},
        {id: 10, name: 'Besançon'},
        {id: 11, name: 'Dijon'},
        {id: 12, name: 'Orléans'},
        {id: 13, name: 'Nantes'},
        {id: 14, name: 'Poitiers'},
        {id: 15, name: 'Limoges'},
        {id: 16, name: 'Clermont-ferrand'},
        {id: 17, name: 'Lyon'},
        {id: 18, name: 'Marseille'},
        {id: 19, name: 'Montpellier'},
        {id: 20, name: 'Toulouse'},
        {id: 21, name: 'Bordeaux'},
        {id: 22, name: 'Ajaccio'}
      ]);
    });
};
