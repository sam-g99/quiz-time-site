const Sequelize = require('sequelize');
const { database } = require('../config');

const connect = () => {
  const {
    name, username, password, host, dialect, port,
  } = database;
  const config = {
    host,
    dialect,
    port,
    logging: false,
  };
  return new Sequelize(name, username, password, config, );
};

module.exports = connect();
