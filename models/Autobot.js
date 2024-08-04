const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Autobot = sequelize.define("Autobot", {
  name: DataTypes.STRING,
  username: DataTypes.STRING,
  email: DataTypes.STRING,
});

Autobot.associate = (models) => {
  Autobot.hasMany(models.Post);
};

module.exports = Autobot;
