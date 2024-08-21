const express = require("express");
const router = express.Router();
const { postItem } = require("../controllers/itemController");
const { isLoggedIn, allowTo } = require("../middleware/authenticate");

router.post("/add-item", isLoggedIn, postItem);

module.exports = router;
