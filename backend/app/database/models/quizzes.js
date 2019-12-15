const {
  STRING, DATE, NOW, INTEGER,
} = require('sequelize');
const database = require('../');

const Quiz = database.define('Quiz', {
  id: {
    type: STRING,
    required: true,
    primaryKey: true,
  },
  title: {
    type: STRING(50),
    required: true,
  },
  description: {
    type: STRING(125),
  },
  created: {
    type: DATE,
    default: NOW,
    required: true,
  },
  user_id: {
    type: INTEGER,
    required: true,
  },
});

module.exports = Quiz;
