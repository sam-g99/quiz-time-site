const {
  STRING, INTEGER, BOOLEAN,
} = require('sequelize');
const database = require('../');

const QuizSessionQuestion = database.define('QuizSessionQuestion', {
  correct: {
    type: BOOLEAN,
    required: true,
  },
  time_spent: {
    type: INTEGER,
    required: true,
  },
  question_id: {
    type: STRING,
    required: true,
  },
  quiz_session_id: {
    type: STRING,
    required: true,
  },
});

module.exports = QuizSessionQuestion;
