const express = require("express");
const router = express.Router();

const {
  getUserAnalytics,
} = require("../services/codeforces");

router.get("/:handle", async (req, res) => {
  try {
    const { handle } = req.params;

    const data = await getUserAnalytics(handle);

    res.json(data);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch user data",
    });
  }
});

module.exports = router;