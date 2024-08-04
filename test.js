const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tweetai_dev", "tweetai_user", "Chukwuma@081", {
  host: "127.0.0.1",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
