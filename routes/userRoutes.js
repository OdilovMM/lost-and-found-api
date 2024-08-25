const express = require("express");
const {
  getAllMyItems,
  updateMyPostStatus,
} = require("../controllers/userController");
const router = express.Router();

router.get("/all-my-items", isLoggedIn, getAllMyItems);
router.patch("/all-my-items/:itemId", isLoggedIn, updateMyPostStatus);

module.exports = router;
