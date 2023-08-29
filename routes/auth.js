const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const RefreshTokens = require("../models/refresh");
const jwt = require("jsonwebtoken");
const { generateAccessToken, getJWTData } = require("../utils");

router.post("/login", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email)
      return res.status(400).send({ msg: "email and name are required" });

    const user = await Users.findOne({
      email: req.body.email,
    });
    if (user) {
      // LOGIN procedure
      console.log(
        "logging",
        user.name !== req.body.name,
        user.name,
        req.body.name
      );
      if (user.name !== req.body.name) {
        return res.status(400).json({
          msg: "Incorrect Credentials: please try again",
        });
      }
      let jwtData = await getJWTData(user, req);
      res.json(jwtData);
    } else {
      // REGISTER procedure
      console.log("registering");
      const userClient = { email: req.body.email, name: req.body.name };
      const newUser = new Users(userClient);
      await newUser.save();
      let jwtData = await getJWTData(userClient, req);
      res.json(jwtData);
    }
  } catch (e) {
    res.status(500).json({
      msg: "Something went wrong",
    });
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
