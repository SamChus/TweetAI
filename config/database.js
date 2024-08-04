const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tweetai_dev', 'tweetai_user', 'Chukwuma@081', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Turn off logging if you don't want to see SQL queries
});

module.exports = sequelize;

