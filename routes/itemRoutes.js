const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-item", authMiddleware.protected, itemController.postItem);
router.get("/all-items", itemController.getAllItems);
router.patch(
  "/all-items/:itemId",
  authMiddleware.protected,
  itemController.updateFoundItem
);
router.get("/all-items/:itemId", itemController.getSingleItem);

module.exports = router;
