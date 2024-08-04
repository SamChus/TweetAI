const cron = require("node-cron");
const axios = require("axios");
const sequelize = require("./config/database");
const Autobot = require("./models/Autobot");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// Helper function to generate unique post titles
const generateUniqueTitle = async () => {
  let title;
  let exists = true;
  while (exists) {
    title = `Post Title ${Math.random().toString(36).substring(7)}`;
    exists = await Post.findOne({ where: { title } });
  }
  return title;
};

// Create 500 Autobots every hour
cron.schedule("0 * * * *", async () => {
  try {
    const { data: users } = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const { data: posts } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const { data: comments } = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );

    for (let i = 0; i < 500; i++) {
      const user = users[i % users.length];
      const autobo = await Autobot.create({
        name: user.name,
        username: user.username,
        email: user.email,
      });

      for (let j = 0; j < 10; j++) {
        const post = posts[(i * 10 + j) % posts.length];
        const uniqueTitle = await generateUniqueTitle();
        const newPost = await Post.create({
          title: uniqueTitle,
          body: post.body,
          AutobotId: autobo.id,
        });

        for (let k = 0; k < 10; k++) {
          const comment = comments[(i * 100 + j * 10 + k) % comments.length];
          await Comment.create({
            body: comment.body,
            postId: newPost.id,
          });
        }
      }
    }

    console.log("500 Autobots created with posts and comments");
  } catch (error) {
    console.error("Error creating Autobots:", error);
  }
});
