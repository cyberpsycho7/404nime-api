const express = require(`express`);
const router = express.Router();
const User = require("../models/userModel");
// const verifyAccessToken = require("../middleware/verifyAccessToken")
const verifyRefreshToken = require("../middleware/verifyRefreshToken");
const generateAccessToken = require("../helpers/generateAccessToken");

router.get("/auth/refresh-token", verifyRefreshToken, async (req, res) => {
  try {
    const accessToken = generateAccessToken(
      req.user.id,
      req.user.login,
      req.user.roles
    );
    res.json({ accessToken, expiresIn: 300 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
