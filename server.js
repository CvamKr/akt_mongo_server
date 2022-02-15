
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");

// parse application/json
// app.use(bodyParser.json());
app.use(express.json());

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// const router = express.Router();
const port = process.env.PORT || 7000;
// getting-started.js
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://taskUser:taskUser@cluster0.igdsh.mongodb.net/mongoChallegeDb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// const mongodb = require("mongodb");
// let db;

// let connectionString =
//   "mongodb+srv://taskUser:taskUser@cluster0.igdsh.mongodb.net/myDatabase?retryWrites=true&w=majority";
// mongodb.connect(
//   connectionString,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err, database) {
//     if (err) {
//       console.error(err.message);
//       return;
//     }
//     db = database.db();
//     // app.listen(7000);
//     console.log("Great! Mongodb Atlas connected!");
//   }
// );

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Great! Mongodb Atlas connected!");
});
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
app.get("/homepage", (req, res) => {
  res.send("LOL Welcome!!!!");
});
// app.use(express.json());

const userRoute = require("./routes/user");
app.use("/user", userRoute);

const quickTaskRoute = require("./routes/quick_task");
app.use("/quickTask", quickTaskRoute);

const accountabilityTeamRoute = require("./routes/accountability_team");
app.use("/accountabilityTeam", accountabilityTeamRoute);
// const userQuickTaskRoute = require("./routes/user_quick_task");
// app.use("/userQuickTask", userQuickTaskRoute);

const inspireChatRoute = require("./routes/inspire_chat");
app.use("/inspireChat", inspireChatRoute);

const goalRoute = require("./routes/goal");
app.use("/goal", goalRoute);

const smallGoalRoute = require("./routes/small_goals");
app.use("/smallGoal", smallGoalRoute);

const groupGoalRoute = require("./routes/group_goals");
app.use("/groupGoal", groupGoalRoute);

const crudOpRoute = require("./routes/crud_op/crud_op");
app.use("/crudOp", crudOpRoute);

const appUrlRoute = require("./routes/app_url");
app.use("/appUrl", appUrlRoute);

const reportedMsgRoute = require("./routes/reported");
app.use("/reportPost", reportedMsgRoute);

const mongoBulkWrite = require("./routes/v2/mongo_bulk_write_testing");
app.use("/mongoBulkWrite", mongoBulkWrite);

const ac_group = require("./routes/v2/v2_ac_group");
app.use("/ac_group", ac_group);

const v2_goals = require("./routes/v2/v2_goals");
app.use("/v2_goals", v2_goals);

const v2_posts = require("./routes/v2/v2_posts");
app.use("/v2_posts", v2_posts);

const v2_users = require("./routes/v2/v2_users");
app.use("/v2_users", v2_users);

module.exports.db = db;
