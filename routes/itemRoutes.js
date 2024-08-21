const express = require("express");
const router = express.Router();
const {
  postItem,
  getAllItems,
  updateFoundItem,
  getSingleItem,
} = require("../controllers/itemController");
const { isLoggedIn, allowTo } = require("../middleware/authenticate");

router.post("/add-item", isLoggedIn, allowTo("user"), postItem);
router.get("/all-items", getAllItems);
router.patch(
  "/all-items/:itemId",
  isLoggedIn,
  allowTo("user"),
  updateFoundItem
);
router.get("/all-items/:itemId", getSingleItem);

module.exports = router;
