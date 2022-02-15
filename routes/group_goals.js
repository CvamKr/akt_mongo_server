const express = require("express");
const router = express.Router();
const db = require("../server");
const ObjectId = require("mongodb").ObjectID;

router.get("/getGroupGoals", async (req, res) => {
  console.log("in getGroup Goals");
  // const query = { accountabilityTeam: { userId: req.params.userId } };

  const query = { _id: ObjectId("607b14aeeae27eec814a1b5e") };

  try {
    const getGroupGoals = await db.db.collection("goalsByUs").findOne(query);

    if (getGroupGoals == null) {
      res.status(404).json({ msg: "no avbl in db" });
    } else {
      res.json(getGroupGoals);
    }
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

module.exports = router;
