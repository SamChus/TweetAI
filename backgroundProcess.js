// backgroundProcess.js
const axios = require("axios");
const Autobot = require("./models/Autobot");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const ShortUniqueId = require("short-unique-id");

const createAutobots = async () => {

  const uid = new ShortUniqueId({
    dictionary: "number",
  });

  console.log(uid.dict);
  try {
    for (let i = 1; i < 500; i++) {
      const { data: user } = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${i}`
      ); 
      const { data: posts } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${i}`
      ); 
      const newAutobot = await Autobot.create({
        name: user.name,
        username: user.username,
        email: user.email,
      });

      for (let j = 0; j < 10; j++) {
        const post = posts[j % posts.length];
        const newPost = await Post.create({
          title: post.title + "_" + newAutobot.id, // Ensure unique title
          body: post.body,
          AutobotId: newAutobot.id,
        });

        const { data: comments } = await axios.get(
          `https://jsonplaceholder.typicode.com/comments?postId=${i}`
        ); 
        for (let k = 0; k < 10; k++) {
          const comment = comments[k % comments.length];
          await Comment.create({
            name: comment.name,
            body: comment.body,
            email: comment.email,
            postId: newPost.id,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error creating Autobots:", error);
  }
};

setInterval(createAutobots, 3600000); // 1 hour in milliseconds
createAutobots(); // Initial call to create Autobots immediately
