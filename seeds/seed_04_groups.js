
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      // Inserts seed entries
      return knex('groups').insert([
          {id: 1, name: 'Nord-Pas-de-Calais', cityId: 1},
          {id: 2, name: 'Picardie', cityId: 2},
          {id: 3, name: 'Haute-Normandie', cityId: 3},
          {id: 4, name: 'Basse-Normandie', cityId: 4},
          {id: 5, name: 'Bretagne', cityId: 5},
          {id: 6, name: 'Île-de-France', cityId: 6},
          {id: 7, name: 'Champagne-Ardenne', cityId: 7},
          {id: 8, name: 'Lorraine', cityId: 8},
          {id: 9, name: 'Alsace', cityId: 9},
          {id: 10, name: 'Franche-Comté', cityId: 10},
          {id: 11, name: 'Bourgogne', cityId: 11},
          {id: 12, name: 'Centre', cityId: 12},
          {id: 13, name: 'Pays de la Loire', cityId: 13},
          {id: 14, name: 'Poitou-Charentes', cityId: 14},
          {id: 15, name: 'Limousin', cityId: 15},
          {id: 16, name: 'Auvergne', cityId: 16},
          {id: 17, name: 'Rhône-Alpes', cityId: 17},
          {id: 18, name: 'Provence-Alpes-Côte d\'Azur', cityId: 18},
          {id: 19, name: 'Languedoc-Roussillon', cityId: 19},
          {id: 20, name: 'Midi-Pyrénées', cityId: 20},
          {id: 21, name: 'Aquitaine', cityId: 21},
          {id: 22, name: 'Corse', cityId: 22}
      ]);
    });
};
