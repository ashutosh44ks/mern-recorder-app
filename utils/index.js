const jwt = require("jsonwebtoken");
const RefreshTokens = require("../models/refresh");

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30min",
  });
};

const getJWTData = async (user, req) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(
    { email: req.body.email },
    process.env.REFRESH_TOKEN_SECRET
  );
  const newRefreshToken = new RefreshTokens({
    email: req.body.email,
    refreshToken: refreshToken,
  });
  await newRefreshToken.save();
  return { accessToken: accessToken, refreshToken: refreshToken };
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function isValidTimestamp(_timestamp) {
  const newTimestamp = new Date(_timestamp).getTime();
  return isNumeric(newTimestamp);
}

// middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
  generateAccessToken,
  authenticateToken,
  getJWTData,
  isValidTimestamp,
};
