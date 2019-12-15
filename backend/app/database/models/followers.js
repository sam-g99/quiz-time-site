const { INT } = require('sequelize');
const database = require('../');

const Follower = database.define('Follower', {
  followed_id: {
    type: INT,
    required: true,
  },
  follower_id: {
    type: INT,
    required: true,
  },
});

module.exports = Follower;
