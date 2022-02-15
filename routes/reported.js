const express = require("express");
const router = express.Router();
const db = require("../server");
const ObjectId = require("mongodb").ObjectID;

router.post("/reportPost", async (req, res) => {
  console.log("in report Post");
  const dataJson = req.body;
  dataJson._id = ObjectId();
  try {
    const reportedMsg = await db.db
      .collection("reportedPosts")
      .insertOne(dataJson);
    res.json(reportedMsg);
    console.log(reportedMsg);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
