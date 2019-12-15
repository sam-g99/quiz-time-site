const { INT } = require('sequelize');
const database = require('../');

const Answer = database.define('Answer', {
  option_id: {
    type: INT,
    required: true,
  },
  time_spent: {
    type: INT,
    required: true,
  },
  user_id: {
    type: INT,
    required: true,
  },

});

module.exports = Answer;
