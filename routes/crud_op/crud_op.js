const express = require("express");
const router = express.Router();
// const UserModel = require("../models/user_model");
const db = require("../../server");
const ObjectId = require("mongodb").ObjectID;

router.put("/updateDoc/:docId/:colName/:topicName", async (req, res) => {
  console.log("in update Route");
  const dataJson = req.body;
  const colName = req.params.colName;

  console.log("dataJson");
  console.log(dataJson);

  // var hex = /[0-9A-Fa-f]{6}/g;
  var docId;
  let isnum = /^\d+$/.test(req.params.docId);
  docId = isnum ? req.params.docId : ObjectId(req.params.docId);
  console.log(docId);

  if (isnum == true) {
    console.log("it is a number");
    console.log(docId);
  } else {
    console.log("it is a hex");
    console.log(ObjectId(docId));
  }
  // var re = /[0-9A-Fa-f]{6}/g;
  // var inputString =req.params.docId;

  // if (re.test(inputString)) {
  //   docId=ObjectId(req.params.docId);
  // } else {
  //   docId=req.params.docId;
  // }
  // var docId = req.params.docId;
  const query = isnum ? { id: docId } : { _id: docId };

  // const topicName = req.body.acTeamId;
  let topicName;
  let displayName;
  let title;
  let body;
  let view;
  let isNotification;
  if (req.params.topicName != "abc" && req.body.$set.status == "accomplished") {
    topicName = req.params.topicName;
    displayName = req.body.$set["by.displayName"];
    title = "Notification from Accountability Group!";
    body =
      "Your Accountability Partner " +
      displayName +
      " just progressed! Hurrah and keep accomplishing together !! ";
    view = "accountability_team";

    console.log(`body: ${body}`);
    isNotification = true;
  }
  // req.body.$set.acTeamId != undefined &&

  try {
    const updateDoc = await db.db
      .collection(colName)
      .updateOne(query, dataJson, { upsert: true });
    res.json(updateDoc);
    console.log(updateDoc);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

router.put("/deleteDoc/:docId/:colName", async (req, res) => {
  console.log("in update Route");
  const colName = req.params.colName;
  var docId;
  let isnum = /^\d+$/.test(req.params.docId);
  docId = isnum ? req.params.docId : ObjectId(req.params.docId);
  console.log(docId);

  if (isnum == true) {
    console.log("it is a number");
    console.log(docId);
  } else {
    console.log("it is a hex");
    console.log(ObjectId(docId));
  }

  const query = isnum ? { id: docId } : { _id: docId };
  console.log(req.params.docId);
  // const topicName = req.body.acTeamId;
  console.log(req.params.id);

  try {
    const deleteDoc = await db.db.collection(colName).deleteOne(query);
    res.json(deleteDoc);
    console.log(deleteDoc);
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});

module.exports = router;
