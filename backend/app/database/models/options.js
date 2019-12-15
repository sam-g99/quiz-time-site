const {
  STRING, BOOLEAN, INTEGER,
} = require('sequelize');
const database = require('../');

const Option = database.define('Option', {
  option: {
    type: STRING(200),
    required: true,
  },
  is_correct: {
    type: BOOLEAN,
    default: false,
    required: true,
  },
  question_id: {
    type: INTEGER,
    required: true,
  },
  quiz_id: {
    type: STRING,
    required: true,
  },
});

module.exports = Option;
