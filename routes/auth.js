const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const RefreshTokens = require("../models/refresh")
const jwt = require("jsonwebtoken");
const { generateAccessToken, login, register } = require("../utils");

router.post("/login", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email)
      return res.status(400).send({ msg: "email and name are required" });

    const user = await Users.findOne({
      email: req.body.email,
    });
    if (user) {
      let jwtData = await login(user, req);
      res.json(jwtData);
    } else {
      let jwtData = await register(req);
      res.json(jwtData);
    }
  } catch (e) {
    res.status(500);
  }
});

router.post("/refresh_token", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    const user = await RefreshTokens.findOne({ refreshToken: refreshToken });
    if (!user._id) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({
        email: user.email,
      });
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    });
  } catch (e) {
    res.status(500);
  }
});

// delete refresh token from database
router.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    await RefreshTokens.deleteOne({ refreshToken: refreshToken });
    res.status(200).json({ msg: "Logged out" });
  } catch (e) {
    res.status(500);
  }
});

module.exports = router;
