const express = require("express");
const router = express.Router();
const db = require("../server");
const ObjectId = require("mongodb").ObjectID;

router.get("/getAppUrl", async (req, res) => {
  console.log("in get appURl");
  try {
    const appUrl = await db.db.collection("appUrl").findOne({
      _id: ObjectId("606b41790965cf9cfe1fffc3"),
    });
    res.json(appUrl);
    console.log(appUrl);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

module.exports = router;
