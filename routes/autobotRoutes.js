const express = require("express");
const router = express.Router();
const { createAutobotsBatch } = require("../controllers/autobotController");



router.get("/autobots", createAutobotsBatch);


module.exports = router;