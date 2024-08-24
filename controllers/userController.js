const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/userModel");
const Items = require("../models/foundItem");
const { StatusCodes } = require("http-status-codes");

const getAllMyItems = async (req, res) => {
  const userId = req.user.userId;
  const my_posts = await User.findById(userId).populate("items");
  const my_posts_length = await User.findById(userId)
    .populate("items")
    .countDocuments();

  res.status(StatusCodes.OK).json({
    my_posts_length,
    my_posts,
  });
};

const updateMyPostStatus = async (req, res) => {
  console.log(req.params);
};

module.exports = {
  getAllMyItems,
  updateMyPostStatus,
};