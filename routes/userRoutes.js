const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get(
  "/all-my-items",
  authMiddleware.protected,
  userController.getAllMyItems
);
router.patch(
  "/all-my-items/:itemId",
  authMiddleware.protected,
  userController.updateMyPostStatus
);

module.exports = router;
