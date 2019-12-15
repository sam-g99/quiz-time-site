const {
  STRING, BOOLEAN, DATE, NOW, INT,
} = require('sequelize');
const database = require('../');

const LoginAttempt = database.define('LoginAttempt', {
  date: {
    type: DATE,
    default: NOW,
  },
  failed: {
    type: BOOLEAN,
    default: false,
  },
  user_agent: {
    type: STRING,
    required: true,
  },
  request_ip: {
    type: STRING,
    required: true,
  },
  user_email: {
    type: STRING,
    required: true,
  },
});

module.exports = LoginAttempt;
