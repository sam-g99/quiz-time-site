const { STRING } = require('sequelize');
const database = require('../');

const Verification = database.define('Verification', {
  code: {
    type: STRING(256),
    required: true,
  },
  user_id: {
    type: STRING,
    required: true,
  },
});

module.exports = Verification;
