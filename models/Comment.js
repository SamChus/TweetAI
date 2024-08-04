const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
  body: DataTypes.TEXT,
});

Comment.associate = (models) => {
  Comment.belongsTo(models.Post);
};

module.exports = Comment;
