const { Model } = require("objection");
const knexConfig = require("./knexfile");
const knex = require('knex')(knexConfig);
Model.knex(knex); // pass knex instance to initialize Model of objection.js
module.exports = knex;