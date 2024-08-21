const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { attachCookieResponse, createSendToken } = require("../utils/jwt");
const createTokenUser = require("../utils/createTokenUser");

const crypto = require("crypto");

const register = async (req, res) => {
  const { email, name, mobile, password } = req.body;

  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new BadRequestError("Email already in use");
  }

  if (!email || !name || !mobile || !password) {
    throw new BadRequestError("Please, provide all credentials");
  }

  const user = await User.create({
    name,
    email,
    password,
    mobile,
  });

  user.password = undefined

  const tokenUser = createTokenUser(user);
  const token = createSendToken({ payload: tokenUser });

  attachCookieResponse({ res, user: token });

  // send verify token
  res.status(StatusCodes.CREATED).json({
    msg: "Account created",
    user,
    tokenUser,
    token,
  });
};

module.exports = {
  register,
};
