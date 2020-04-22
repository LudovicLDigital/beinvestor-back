
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('geo_adress').del()
    .then(function () {
      // Inserts seed entries
      return knex('geo_adress').insert([
        {id: 1, latitude: '50.6317096', longitude: '3.0686861'},
        {id: 2, latitude: '49.894265', longitude: '2.296022'},
        {id: 3, latitude: '49.443113', longitude: '1.099926'},
        {id: 4, latitude: '49.1846787', longitude: '-0.4072783'},
        {id: 5, latitude: '48.1159675', longitude: '-1.7234738'},
        {id: 6, latitude: '48.8589507', longitude: '2.2770204'},
        {id: 7, latitude: '48.965625', longitude: '4.3450326'},
        {id: 8, latitude: '49.1049039', longitude: '6.1613867'},
        {id: 9, latitude: '48.5692059', longitude: '7.6920545'},
        {id: 10, latitude: '47.2603107', longitude: '5.9422289'},
        {id: 11, latitude: '47.3319338', longitude: '4.9972017'},
        {id: 12, latitude: '47.8735098', longitude: '1.842169'},
        {id: 13, latitude: '47.2383172', longitude: '-1.6300956'},
        {id: 14, latitude: '46.5846876', longitude: '0.3364501'},
        {id: 15, latitude: '45.8587392', longitude: '1.161858'},
        {id: 16, latitude: '45.7797123', longitude: '3.0866553'},
        {id: 17, latitude: '45.75801', longitude: '4.8001016'},
        {id: 18, latitude: '43.2804942', longitude: '5.3104568'},
        {id: 19, latitude: '43.6100788', longitude: '3.8391421'},
        {id: 20, latitude: '43.6008029', longitude: '1.3628014'},
        {id: 21, latitude: '44.8637834', longitude: '-0.6211604'},
        {id: 22, latitude: '41.922785', longitude: '8.6708216'},
      ]);
    });
};
