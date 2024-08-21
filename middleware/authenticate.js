const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { verifyMyToken, attachCookieResponse } = require("../utils/jwt");

// only logged users
const isLoggedIn = async (req, res, next) => {
  const { token } = req.signedCookies;

  try {
    if (token) {
      const payload = verifyMyToken(token);
      req.user = payload.user;
      return next();
    }
    throw new UnauthenticatedError("Authentication failed");
  } catch (error) {
    throw new UnauthenticatedError("You are not logged in. Please, Log in");
  }
};

// Role based authorization
const allowTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError(
        `As a ${req.user.role.toUpperCase()}, You are not authorized to do this action, only ${roles} is allowed`
      );
    }
    next();
  };
};

module.exports = { isLoggedIn, allowTo };
