const express = require("express");
const router = express.Router();
const {
  createClaim,
  getClaimsForItem,
  updateClaimStatus,
} = require("../controllers/claimController");

const { isLoggedIn } = require("../middleware/authenticate");

router.post("/", isLoggedIn, createClaim);
router.get("/:itemId", isLoggedIn, getClaimsForItem);
router.patch("/:claimId", isLoggedIn, updateClaimStatus);

module.exports = router;
