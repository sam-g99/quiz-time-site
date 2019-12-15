const {
  STRING, DATE, NOW, INT,
} = require('sequelize');
const database = require('../');

const Session = database.define('Session', {
  device: {
    type: STRING(256),
    required: true,
  },
  cookie: {
    type: STRING(256),
    required: true,
  },
  date: {
    type: DATE,
    default: NOW,
    required: true,
  },
  user_id: {
    type: INT,
    required: true,
  },
});

module.exports = Session;
