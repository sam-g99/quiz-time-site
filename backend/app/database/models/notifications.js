const {
  STRING, BOOLEAN, INT,
} = require('sequelize');
const database = require('../');

const Notification = database.define('Notification', {
  title: {
    type: STRING,
    required: true,
  },
  description: {
    type: STRING,
    required: true,
  },
  checked: {
    type: BOOLEAN,
    default: false,
    required: true,
  },
  user_id: {
    type: INT,
    required: true,
  },
});

module.exports = Notification;
