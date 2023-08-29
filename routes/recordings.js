const express = require("express");
const router = express.Router();
const Recordings = require("../models/recordings");
const { authenticateToken, isValidTimestamp } = require("../utils");

router.post("/startRecording", authenticateToken, async (req, res) => {
  try {
    let { webcam, screen, startTime } = req.body;
    if (webcam === false && screen === false)
      res.status(422).json({ msg: "Please check webcam and screensharing" });
    if (!isValidTimestamp(startTime))
      res.status(422).json({ msg: "Invalid timestamps" });
    const myRecord = new Recordings({
      webcam,
      screen,
      startTime,
      email: req.user.email,
    });
    await myRecord.save();
    res.json({ msg: "saved", data: myRecord });
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
router.patch("/stopRecording", authenticateToken, async (req, res) => {
  try {
    let { id, endTime } = req.body;
    if (!isValidTimestamp(endTime))
      res.status(422).json({ msg: "Invalid timestamp" });
    const myRecording = await Recordings.findById(id);
    if (!myRecording)
      res.status(404).json({ msg: "Could not find existing recording" });
    myRecording.endTime = endTime;
    await myRecording.save();
    res.json({ msg: "saved", data: myRecording });
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
