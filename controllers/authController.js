const catchAsync = require("./../utils/catchAsync");
const authService = require("../service/authService");
const bunyan = require("bunyan");
const { createSendToken } = require("../middleware/authMiddleware");

const log = bunyan.createLogger({ name: "authController" });

exports.register = catchAsync(async (req, res, next) => {
  const data = req.body;
  try {
    const user = await authService.registerData(data);
    createSendToken(user, 201, res);
  } catch (error) {
    log.error(error);
    next(error);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const data = req.body;
  try {
    const user = await authService.loginData(data);
    console.log(user);
    createSendToken(user, 200, res);
  } catch (error) {
    log.error(error);
    next(error);
  }
});

exports.logout = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logging out",
  });
};
