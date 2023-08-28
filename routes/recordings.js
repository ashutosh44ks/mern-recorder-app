const express = require("express");
const router = express.Router();
const Recordings = require("../models/recordings");
const { authenticateToken } = require("../utils");

router.post("/", authenticateToken, async (req, res) => {
  const myRecord = new Recordings({
    ...req.body,
    email: req.user.email,
  });
  await myRecord.save();
  res.json({ msg: "saved", data: myRecord });
});

module.exports = router;
