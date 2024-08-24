const { UnauthenticatedError } = require("../errors");
const { verifyMyToken } = require("../utils/jwt");

const isLoggedIn = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError("You are not logged in. first Error in Authentication");
  }

  try {
    const { name, userId, role } = verifyMyToken(token);
    req.user = { name: name, userId: userId, role: role };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    throw new UnauthenticatedError("You are not logged in. Please, Log in Second error");
  }
};

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
