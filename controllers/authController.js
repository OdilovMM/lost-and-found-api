const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { attachCookieResponse, createSendToken } = require("../utils/jwt");
const createTokenUser = require("../utils/createTokenUser");

const register = async (req, res) => {
  const { email, name, mobile, password } = req.body;
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new BadRequestError("Bunday email ro'yxatdan o'tilgan");
  }

  const existNumber = await User.findOne({ mobile });
  if (existNumber) {
    throw new BadRequestError("Bunday mobile raqam bilan  ro'yxatdan o'tilgan");
  }

  if (!email || !name || !mobile || !password) {
    throw new BadRequestError("Iltimos, barcha ma'lumotlarni kiriting");
  }

  const user = await User.create({
    name,
    email,
    password,
    mobile,
  });

  user.password = undefined;

  const tokenUser = createTokenUser(user);
  const token = createSendToken({ payload: tokenUser });
  attachCookieResponse({ res, user: token });
  res.status(StatusCodes.CREATED).json({
    msg: "Hisob yaratildi",
    user,
    tokenUser,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Iltimos, barcha ma'lumotlarni kiriting");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Bunday hisob ro'yxatdan o'tilmagan");
  }

  if (user.status === "blocked") {
    throw new UnauthenticatedError("Sizning akkauntingiz bloklangan");
  }

  if (user.status === "deleted") {
    throw new UnauthenticatedError("Sizning akkauntingiz o'chirilgan ");
  }

  const isMatchPassword = await user.comparePassword(password);

  if (!isMatchPassword) {
    throw new UnauthenticatedError("No'to'g'ri parol");
  }
  const tokenUser = createTokenUser(user);
  const token = createSendToken({ payload: tokenUser });
  attachCookieResponse({ res, user: tokenUser });
  user.password = "";
  res.status(StatusCodes.OK).json({ msg: "Hisobga kirildi", user, token });
};

const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ msg: "Akkauntdan chiqildi" });
};

module.exports = {
  register,
  login,
  logout,
};
