const {
  STRING, DATE, NOW, INTEGER,
} = require('sequelize');
const database = require('../');

const Session = database.define('Session', {
  device: {
    type: STRING(500),
    required: true,
  },
  cookie: {
    type: STRING(500),
    required: true,
  },
  date: {
    type: DATE,
    default: NOW,
    required: true,
  },
  user_id: {
    type: INTEGER,
    required: true,
  },
});

module.exports = Session;
