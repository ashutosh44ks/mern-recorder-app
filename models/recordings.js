const mongoose = require("mongoose");

const recordingsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  webcam: {
    type: Boolean,
    required: true,
  },
  screen: {
    type: Boolean,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  base64Blob: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Recordings", recordingsSchema);
