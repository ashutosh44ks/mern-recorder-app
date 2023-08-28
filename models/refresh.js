const mongoose = require("mongoose");

const RefreshTokens = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("RefreshTokens", RefreshTokens);
