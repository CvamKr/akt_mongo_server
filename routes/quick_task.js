const express = require("express");
const router = express.Router();
// var now = new Date();
// var offset = now.getTimezoneOffset();
// var postedHourLocalTime = new Date(now.getDate - offset * 60000);
// var hourAndMin = postedHourLocalTime
//   .toISOString()
//   .replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1");
var today = new Date();
var localToday = today;
// .toLocaleTimeString;
var hour = localToday.getHours();
var minutes = localToday.getMinutes();
// var hourAndMin =
//   localToday.getHours() + ":" + localToday.getMinutes();
//  + ":" + today.getSeconds();
const QuickTaskModel = require("../models/quick_task_model");
const db = require("../server");
router.post("/createQuickTask", async (req, res) => {
  const userQuickTask = new QuickTaskModel({
    title: req.body.title,
    duration: req.body.duration,
    accountabilityTeam: req.body.accountabilityTeam,
    isPrivate: req.body.isPrivate,
    checkList: req.body.checkList,
    // postedOn: req.body.postedOn,
    postedOn: new Date(),
    postedBy: req.body.postedBy,
    userStreak: req.body.userStreak,
    postedLocalHour: hour,
    postedLocalMinute: minutes,
  });
  try {
    const newUserQuickTask = await userQuickTask.save();
    res.status(201).json(newUserQuickTask);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.get("/getQuickTask", async (req, res) => {
  try {
    let userQuickTask = await QuickTaskModel.find().sort({ postedOn: -1 });
    res.json(userQuickTask);
  } catch (e) {
    res.json({ msg: e });
  }
});

router.post("/create100quickTasks", async (req, res) => {
  for (let i = 1; i < 100; i++) {
    console.log(`i = ${i}`);
    const quickTask = new QuickTaskModel({
      title: `quick task ${i}`,
      duration: i + 5,
      checkList: ["Breathe", "Meditate"],
      isPrivate: i % 2 == 0 ? true : false,
      postedOn: "2020-06-01T08:08:08",
      postedBy: `user ${i}`,
      userStreak: i,
    });

    try {
      // let newUser =
      await quickTask.save();
      // res.json(newUser);
      console.log(`quick task created is: quick task ${i}`);
    } catch (error) {
      res.status(400).json({ msg: error });
    }
  }
  res.json({ msg: "100 quick tasks created!" });
});

// Without Mongoose
router.post("/createAQuickTask", async (req, res) => {
  const dataJson = req.body;

  try {
    const createdQuickTask = await db.db
      .collection("quicktasks")
      .insertOne(dataJson);
    res.json(createdQuickTask);
    console.log(createdQuickTask);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getQuickTasks", async (req, res) => {
  try {
    const fetchedQuickTasks = await await db.db
      .collection("quicktasks")
      .find({})
      .toArray();
    res.json(fetchedQuickTasks);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
