const {
  STRING, BOOLEAN, DATE, NOW,
} = require('sequelize');
const database = require('..');

const User = database.define('User', {
  username: {
    type: STRING(16),
    unique: true,
    required: true,
  },
  password: {
    type: STRING(256),
    required: true,
  },
  email: {
    type: STRING(320),
    required: true,
    unique: true,
  },
  verified: {
    type: BOOLEAN,
    default: false,
  },
  verification: {
    type: STRING,
  },
  signUpIp: {
    type: STRING,
  },
  created: {
    type: DATE,
    default: NOW,
    required: true,
  },
});

module.exports = User;
