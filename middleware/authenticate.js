const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { verifyMyToken } = require("../utils/jwt");

// only logged users
const isLoggedIn = async (req, res, next) => {
  const token = req.signedCookies.token;
  console.log("Signed Token:", token);

  if (!token) {
    throw new UnauthenticatedError("You are not logged in. Please, Log in");
  }

  try {
    const { name, userId, role } = verifyMyToken(token);
    req.user = { name: name, userId: userId, role: role };
    console.log("User:", req.user);
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    throw new UnauthenticatedError("You are not logged in. Please, Log in");
  }
};

// Role based authorization
const allowTo = (...roles) => {
  console.log("Roles allowed:", roles);
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
