const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");
const sequelize = require("./config/database");
const Autobot = require("./models/Autobot");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const app = express();
const cors = require('cors'); 
const server = http.createServer(app);
require("./backgroundProcess");
const io = socketIo(server, {
  cors: {
    origin: "http://127.0.0.1:5501", // Replace with your client URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});



const PORT = process.env.PORT || 8000;

// Use the cors middleware
app.use(cors({
  origin: "http://127.0.0.1:5501" // Replace with your client URL
}));

// Middleware
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
});

app.use(limiter);

// Routes
app.get("/autobots", async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    const autobots = await Autobot.findAll({ limit, offset });
    res.json(autobots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/autobots/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const autobo = await Autobot.findByPk(id);
    if (autobo) {
      res.json(autobo);
    } else {
      res.status(404).json({ error: "Autobot not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/autobots/:id/posts", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const posts = await Post.findAll({
      where: { AutobotId: id },
      limit,
      offset,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await Comment.findAll({
      where: { postId: id },
      limit,
      offset,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files
app.use(express.static("public"));



io.on("connection", (socket) => {
  console.log("New client connected");

  const updateAutobotCount = async () => {
    const count = await Autobot.count();
    socket.emit("autobotCount", count);
  };

  updateAutobotCount();

  const intervalId = setInterval(updateAutobotCount, 1000); // update every second

  socket.on("disconnect", () => {
    clearInterval(intervalId);
    console.log("Client disconnected");
  });
});

// Sync database and start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to create the database & tables:", err);
  });
