const Claim = require("../models/claimModel");
const Item = require("../models/foundItem");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createClaim = async (req, res) => {
  const { itemId, firstAnswer, secondAnswer, message, name, mobile } = req.body;

  const item = await Item.findById(itemId);
  if (!item) {
    throw new NotFoundError("Topilgan buyum mavjud emas");
  }
  const existingClaim = await Claim.findOne({
    itemId,
    userId: req.user.userId,
  });
  if (existingClaim) {
    throw new BadRequestError("Siz allaqachon bu buyumga da'vo qilgansiz");
  }

  const claim = await Claim.create({
    itemId,
    userId: req.user.userId,
    firstAnswer,
    secondAnswer,
    message,
    name,
    mobile,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Buyum uchun da'vo yaratildi", claim });
};

const getClaimsForItem = async (req, res) => {
  const { itemId } = req.params;

  const item = await Item.findById(itemId);
  if (!item) {
    throw new NotFoundError("Topilgan buyum mavjud emas");
  }

  const claims = await Claim.find({ itemId }).populate("userId", "name email");
  res.status(StatusCodes.OK).json({ claims, count: claims.length });
};

const updateClaimStatus = async (req, res) => {
  const { claimId } = req.params;
  const { status } = req.body;

  const claim = await Claim.findById(claimId);
  if (!claim) {
    throw new NotFoundError("Da'vo topilmadi");
  }

  claim.status = status;
  await claim.save();
  res.status(StatusCodes.OK).json({ msg: "Da'vo holati yangilandi", claim });
};

module.exports = {
  createClaim,
  getClaimsForItem,
  updateClaimStatus,
};
