const express = require("express");
const router = express.Router();
// const InspireChatModel = require("../models/inspire_chat_model");
const db = require("../server");
const ObjectId = require("mongodb").ObjectID;

router.post("/createInspireChat", async (req, res) => {
  // const inspireChat = new InspireChatModel({
  //   displayName: req.body.displayName,
  //   userMessage: req.body.userMessage,
  //   tags: req.body.tags,
  //   postedOn: req.body.postedOn,
  // });

  console.log("acTeamId: ");
  console.log(req.body.accountabilityTeamId);
  if (
    req.body.accountabilityTeamId == "want" ||
    req.body.accountabilityTeamId == "dontWant"
  ) {
    console.log("in if");
  } else {
    req.body.accountabilityTeamId = ObjectId(req.body.accountabilityTeamId);

    console.log("in else");
  }

  try {
    const newInspireChat = await db.db
      .collection("inspireChats")
      .insertOne(req.body);
    res.json(newInspireChat.ops[0]);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.get("/getInspireChat", async (req, res) => {
  try {
    const inspireChat = await db.db
      .collection("inspireChats")
      .find({})
      .limit(30)
      .sort({ postedOn: -1 })
      .toArray();

    res.json(inspireChat);
  } catch (e) {
    res.json({ msg: e.msg });
  }
});

router.get("/getICbyTags/:tags", async (req, res) => {
  try {
    let inspireChat = await db.db
      .collection("inspireChats")
      .find({ tags: req.params.tags })
      .limit(30)
      .sort({ postedOn: -1 })
      .toArray();

    // InspireChatModel.find({ tags: req.params.tags });
    res.json(inspireChat);
  } catch (e) {
    res.json({ msg: e });
  }
});

router.get("/getICbyTags/:tags/:global/:acTeamId", async (req, res) => {
  console.log("=======================\ninside get Ic by tags");
  const isGlobal = JSON.parse(req.params.global);
  // console.log(`isGlobal: ${isGlobal}`);
  console.log(`isGlobal: ${req.params.global}`);
  console.log(`type of req.params.global is:  ${typeof req.params.global}`);

  console.log(typeof req.params.global);

  console.log(typeof isGlobal);

  let query = {};
  if (req.params.tags == "all") {
    console.log("in tag all");
    query =
      isGlobal == true
        ? {}
        : { accountabilityTeamId: ObjectId(req.params.acTeamId) };
    console.log("query is");
    console.log(query);
  } else {
    query =
      isGlobal == true
        ? { tags: req.params.tags }
        : {
            tags: req.params.tags,
            accountabilityTeamId: ObjectId(req.params.acTeamId),
          };
  }
  try {
    let inspireChat = await db.db
      .collection("inspireChats")
      .find(query)
      .limit(30)
      .sort({ postedOn: -1 })
      .toArray();

    // InspireChatModel.find({ tags: req.params.tags });
    res.json(inspireChat);
    // console.log(inspireChat);
    console.log(query);
    console.log(req.params.tags);
    console.log(req.params.global);
  } catch (e) {
    res.json({ msg: e });
  }
});

module.exports = router;
