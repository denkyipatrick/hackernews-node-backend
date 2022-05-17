const APP_SECRET = "application_secret";
const jwt = require("jsonwebtoken");

const decodeAuthHeader = (authHeader) => {
  authHeader = authHeader.replace("Bearer ", "");

  const payload = jwt.verify(authHeader, APP_SECRET);
  const { userId } = payload;

  return parseInt(userId);
};

module.exports = {
  APP_SECRET,
  decodeAuthHeader,
};
