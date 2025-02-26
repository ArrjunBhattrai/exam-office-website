const knex = require("knex");
const { development } = require("../knexfile");

const db = knex(development);
module.exports = db;
