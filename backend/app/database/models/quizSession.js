const {
  STRING, INTEGER, BOOLEAN,
} = require('sequelize');
const database = require('../');

const QuizSession = database.define('QuizSession', {
  id: {
    type: STRING,
    required: true,
    primaryKey: true,
  },
  time: {
    type: INTEGER,
    required: true,
  },
  wrong: {
    type: INTEGER,
    required: true,
  },
  right: {
    type: INTEGER,
    required: true,
  },
  amount_of_questions: {
    type: INTEGER,
    required: true,
  },
  finished: {
    type: BOOLEAN,
    required: true,
  },
  quiz_id: {
    type: STRING,
    required: true,
  },
  user_id: {
    type: INTEGER,
    required: true,
  },
});

module.exports = QuizSession;
