const jwt = require("jsonwebtoken");

const createSendToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const verifyMyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookieResponse = ({ res, user }) => {
  const daysToExpire = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10);
  const expires = new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1000);

  const token = createSendToken({ payload: user });
  res.cookie("token", token, {
    httpOnly: true,
    expires: expires,
    secure: req.secure || req.headers('x-forwarded-proto') === 'https',
    signed: true,
  });
};

module.exports = {
  createSendToken,
  verifyMyToken,
  attachCookieResponse,
};
