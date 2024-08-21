const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { isLoggedIn } = require("../middleware/authenticate");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);

module.exports = router;
