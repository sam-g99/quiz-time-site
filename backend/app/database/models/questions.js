const {
  STRING, INTEGER,
} = require('sequelize');
const database = require('../');

const Question = database.define('Question', {
  question: {
    type: STRING(256),
    required: true,
  },
  quiz_id: {
    type: STRING,
    required: true,
  },
});

module.exports = Question;
