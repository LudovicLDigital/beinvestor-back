
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('city').del()
    .then(function () {
      // Inserts seed entries
      return knex('city').insert([
        {id: 1, name: 'Lille', geoAdressId: 1},
        {id: 2, name: 'Amiens', geoAdressId: 2},
        {id: 3, name: 'Rouen', geoAdressId: 3},
        {id: 4, name: 'Caen', geoAdressId: 4},
        {id: 5, name: 'Rennes', geoAdressId: 5},
        {id: 6, name: 'Paris', geoAdressId: 6},
        {id: 7, name: 'Châlons-en-champagne', geoAdressId: 7},
        {id: 8, name: 'Metz', geoAdressId: 8},
        {id: 9, name: 'Strasbourg', geoAdressId: 9},
        {id: 10, name: 'Besançon', geoAdressId: 10},
        {id: 11, name: 'Dijon', geoAdressId: 11},
        {id: 12, name: 'Orléans', geoAdressId: 12},
        {id: 13, name: 'Nantes', geoAdressId: 13},
        {id: 14, name: 'Poitiers', geoAdressId: 14},
        {id: 15, name: 'Limoges', geoAdressId: 15},
        {id: 16, name: 'Clermont-ferrand', geoAdressId: 16},
        {id: 17, name: 'Lyon', geoAdressId: 17},
        {id: 18, name: 'Marseille', geoAdressId: 18},
        {id: 19, name: 'Montpellier', geoAdressId: 19},
        {id: 20, name: 'Toulouse', geoAdressId: 20},
        {id: 21, name: 'Bordeaux', geoAdressId: 21},
        {id: 22, name: 'Ajaccio', geoAdressId: 22}
      ]);
    });
};
