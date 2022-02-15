const express = require("express");
const router = express.Router();
const db = require("../server");
const ObjectId = require("mongodb").ObjectID;

router.get("/getSmallGoals", async (req, res) => {
  console.log("in getSmall Goals");
  // const query = { accountabilityTeam: { userId: req.params.userId } };

  const query = { _id: ObjectId("602bfa53baf86d4f8fe4d38d") };

  try {
    const getSmallGoals = await db.db.collection("goalsByUs").findOne(query);

    if (getSmallGoals == null) {
      res.status(404).json({ msg: "no avbl in db" });
    } else {
      res.json(getSmallGoals);
    }
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

module.exports = router;
