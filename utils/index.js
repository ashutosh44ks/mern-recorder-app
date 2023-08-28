const jwt = require("jsonwebtoken");
const RefreshTokens = require("../models/refresh");
const Users = require("../models/users");

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30min",
  });
};

const login = async (user, req, res) => {
  // LOGIN procedure
  console.log("logging");
  if (user.name !== req.body.name) {
    return res.status(400).send({
      msg: "Incorrect Credentials, only 1 name can be assigned to 1 email",
    });
  }
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
const register = async (req) => {
  // REGISTER procedure
  console.log("registering");
  const userClient = { email: req.body.email, name: req.body.name };
  const newUser = new Users(userClient);
  await newUser.save();

  const accessToken = generateAccessToken(userClient);
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
  login,
  register,
};
