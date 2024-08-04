const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define("Post", {
  title: DataTypes.STRING,
  body: DataTypes.TEXT,
});

Post.associate = (models) => {
  Post.belongsTo(models.Autobot);
  Post.hasMany(models.Comment);
};

module.exports = Post;
